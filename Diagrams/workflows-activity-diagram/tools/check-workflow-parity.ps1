[CmdletBinding()]
param(
    [string] $ManifestPath,
    [string] $OutputPath,
    [switch] $SkipRegressionFixture
)

$ErrorActionPreference = 'Stop'
$workflowRoot = Split-Path -Parent $PSScriptRoot
$docsRoot = Split-Path -Parent (Split-Path -Parent $workflowRoot)
$ManifestPath = if ($ManifestPath) { $ManifestPath } else { Join-Path $PSScriptRoot 'behavior-parity-manifest.json' }
$OutputPath = if ($OutputPath) { $OutputPath } else { Join-Path $workflowRoot 'evidence\workflow-parity-check-2026-09-14.json' }
$indexPath = Join-Path $workflowRoot 'index.md'
$drawioDirectory = Join-Path $workflowRoot 'drawio'
$fixturePath = Join-Path $PSScriptRoot 'wf15-parity-regression-fixture.json'

function Normalize-Text([object] $Value) {
    if ($null -eq $Value) { return '' }
    $text = [System.Net.WebUtility]::HtmlDecode([string] $Value)
    $text = $text -replace '<[^>]+>', ' '
    $text = $text -replace '\s+', ' '
    return $text.Trim().Trim('"')
}

function Get-CellType($Cell) {
    $style = [string] $Cell.style
    if ($style -match 'shape=endState') { return 'activityFinal' }
    if ($style -match 'shape=step') { return 'acceptEvent' }
    if ($style -match 'rhombus') { return 'decision' }
    if ($style -match 'ellipse') { return 'flowFinal' }
    return 'action'
}

function Get-LaneName($Cell, $CellById) {
    $parentId = [string] $Cell.parent
    while ($parentId -and $CellById.ContainsKey($parentId)) {
        $parent = $CellById[$parentId]
        if (([string] $parent.style) -match 'swimlane') {
            $label = Normalize-Text $parent.value
            if ($label) { return $label }
        }
        $parentId = [string] $parent.parent
    }
    return ''
}

function Get-Graph($Path) {
    [xml] $xml = Get-Content -LiteralPath $Path -Raw -Encoding utf8
    $cells = @($xml.mxfile.diagram.mxGraphModel.root.mxCell)
    $cellById = @{}
    foreach ($cell in $cells) { $cellById[[string] $cell.id] = $cell }
    $edges = @($cells | Where-Object { $_.edge -eq '1' -and $_.source -and $_.target } | ForEach-Object {
        [pscustomobject]@{
            source = [string] $_.source
            target = [string] $_.target
            guard = Normalize-Text $_.value
            style = [string] $_.style
        }
    })
    [pscustomobject]@{
        cells = $cells
        cellById = $cellById
        controlEdges = $edges | Where-Object { $_.style -notmatch 'dashed=1' }
    }
}

function Get-MermaidBlock($IndexText, $Heading) {
    $headingIndex = $IndexText.IndexOf("### $Heading", [System.StringComparison]::Ordinal)
    if ($headingIndex -lt 0) { throw "Heading not found in index: $Heading" }
    $tail = $IndexText.Substring($headingIndex)
    $nextHeading = [regex]::Match($tail.Substring(1), '(?m)^### ')
    if ($nextHeading.Success) { $tail = $tail.Substring(0, $nextHeading.Index + 1) }
    $match = [regex]::Match($tail, '(?s)```mermaid\s*(?<code>.*?)\s*```')
    if (-not $match.Success) { throw "Mermaid block not found under heading: $Heading" }
    return $match.Groups['code'].Value
}

function Get-MermaidEdges($Mermaid) {
    $items = @()
    foreach ($line in ($Mermaid -split "`r?`n")) {
        $match = [regex]::Match($line, '^\s*(?<source>[A-Za-z0-9]+)\s+-->\s*(?:\|"?(?<guard>[^|]+)"?\|)?\s*(?<target>[A-Za-z0-9]+)')
        if ($match.Success) {
            $items += [pscustomobject]@{
                source = $match.Groups['source'].Value
                target = $match.Groups['target'].Value
                guard = Normalize-Text $match.Groups['guard'].Value
            }
        }
    }
    return $items
}

function Test-Edge($Edges, $Expected) {
    $expectedGuard = Normalize-Text $Expected.guard
    return @($Edges | Where-Object {
        $_.source -eq $Expected.source -and $_.target -eq $Expected.target -and $_.guard -eq $expectedGuard
    }).Count -gt 0
}

function Test-MermaidNode($Mermaid, $Expected) {
    $line = [regex]::Match($Mermaid, '(?m)^\s*' + [regex]::Escape($Expected.id) + '\s*(?:\[|\{|\(|>)\s*(?<label>.*)$')
    if (-not $line.Success) { return $false }
    return (Normalize-Text $line.Groups['label'].Value).Contains((Normalize-Text $Expected.labelContains))
}

function Get-DuplicateCandidates([object[]] $Vertices) {
    $candidates = @()
    for ($left = 0; $left -lt $Vertices.Count; $left++) {
        for ($right = $left + 1; $right -lt $Vertices.Count; $right++) {
            $a = $Vertices[$left]
            $b = $Vertices[$right]
            if ($a.parent -eq $b.parent -or $a.type -ne $b.type) { continue }
            if ((Normalize-Text $a.label).ToLowerInvariant() -ne (Normalize-Text $b.label).ToLowerInvariant()) { continue }
            if (-not (Normalize-Text $a.label)) { continue }
            $near = $true
            for ($i = 0; $i -lt 4; $i++) {
                if ([math]::Abs([double] $a.bounds[$i] - [double] $b.bounds[$i]) -gt 1) { $near = $false; break }
            }
            if ($near) {
                $candidates += [pscustomobject]@{
                    firstId = $a.id
                    secondId = $b.id
                    label = Normalize-Text $a.label
                    type = $a.type
                    firstParent = $a.parent
                    secondParent = $b.parent
                    firstIncoming = @($a.incoming)
                    firstOutgoing = @($a.outgoing)
                    secondIncoming = @($b.incoming)
                    secondOutgoing = @($b.outgoing)
                }
            }
        }
    }
    return $candidates
}

function Get-MermaidNodeLabel($Mermaid, $Id) {
    $pattern = '(?m)^\s*' + [regex]::Escape($Id) + '\s*(?:\[\[|\(\[|\[|\{|>)\s*"?(?<label>.*?)"?\s*(?:\]\]|\]\)|\]|\})\s*$'
    $match = [regex]::Match($Mermaid, $pattern)
    if (-not $match.Success) { return $null }
    return Normalize-Text $match.Groups['label'].Value
}

$manifest = Get-Content -LiteralPath $ManifestPath -Raw -Encoding utf8 | ConvertFrom-Json
$indexText = Get-Content -LiteralPath $indexPath -Raw -Encoding utf8
$pageResults = @()
$errors = @()

# Nội dung normative hiển thị trong note không nằm trong graph control-flow, nên phép so
# node/edge không bắt được khi nó lệch. Quét cả tệp gộp để source rời và tệp gộp không trôi khỏi nhau.
# Giá trị note phải lấy qua XML theo từng trang: giải mã HTML rồi strip tag trên text thô của cả
# tệp sẽ làm regex nuốt mất phần đầu chuỗi, vì '&lt;br&gt;' biến thành '>' đóng tag giả.
$combinedRawDecoded = ''
$combinedCellsByPage = @{}
if ($manifest.combinedSource) {
    $combinedPath = Join-Path $workflowRoot $manifest.combinedSource
    if (Test-Path -LiteralPath $combinedPath -PathType Leaf) {
        $combinedRawDecoded = [System.Net.WebUtility]::HtmlDecode((Get-Content -LiteralPath $combinedPath -Raw -Encoding utf8))
        [xml] $combinedXml = Get-Content -LiteralPath $combinedPath -Raw -Encoding utf8
        foreach ($diagram in @($combinedXml.mxfile.diagram)) {
            $cellMap = @{}
            foreach ($cell in @($diagram.mxGraphModel.root.mxCell)) { $cellMap[[string] $cell.id] = $cell }
            $combinedCellsByPage[[string] $diagram.name] = $cellMap
        }
    } else {
        $errors += "combined source missing: $($manifest.combinedSource)"
    }
}

function Get-CombinedCells($PageId) {
    foreach ($name in $combinedCellsByPage.Keys) {
        if ($name -like "$PageId*") { return $combinedCellsByPage[$name] }
    }
    return $null
}

foreach ($page in $manifest.pages) {
    $sourcePath = Join-Path $workflowRoot $page.source
    $graph = Get-Graph $sourcePath
    $mermaid = Get-MermaidBlock $indexText $page.heading
    $mermaidEdges = Get-MermaidEdges $mermaid
    $pageErrors = @()

    foreach ($node in $page.nodes) {
        if (-not $graph.cellById.ContainsKey($node.id)) {
            $pageErrors += "drawio node missing: $($node.id)"
            continue
        }
        $cell = $graph.cellById[$node.id]
        if ((Get-CellType $cell) -ne $node.type) { $pageErrors += "drawio node type differs: $($node.id)" }
        if ((Get-LaneName $cell $graph.cellById) -ne $node.lane) { $pageErrors += "drawio lane differs: $($node.id)" }
        if (-not (Normalize-Text $cell.value).Contains((Normalize-Text $node.labelContains))) { $pageErrors += "drawio label differs: $($node.id)" }
        if (-not (Test-MermaidNode $mermaid $node)) { $pageErrors += "Mermaid node/label differs: $($node.id)" }
    }

    foreach ($edge in $page.edges) {
        if (-not (Test-Edge $graph.controlEdges $edge)) { $pageErrors += "drawio edge differs: $($edge.source) -> $($edge.target) [$($edge.guard)]" }
        if (-not (Test-Edge $mermaidEdges $edge)) { $pageErrors += "Mermaid edge differs: $($edge.source) -> $($edge.target) [$($edge.guard)]" }
    }

    # Outgoing control-edge counts. Dashed information edges are already excluded from
    # $graph.controlEdges, and the Mermaid parser only matches solid '-->' links, so an
    # information edge can never inflate either side of this assertion.
    $controlEdgeCountResults = @()
    foreach ($expectedCount in $page.controlEdgeCounts) {
        $nodeId = [string] $expectedCount.node
        if (-not $graph.cellById.ContainsKey($nodeId)) {
            $pageErrors += "control-edge-count node missing in drawio: $nodeId"
            continue
        }
        $drawioOutgoing = @($graph.controlEdges | Where-Object { $_.source -eq $nodeId })
        $mermaidOutgoing = @($mermaidEdges | Where-Object { $_.source -eq $nodeId })
        if ($drawioOutgoing.Count -ne [int] $expectedCount.outgoing) {
            $pageErrors += "drawio outgoing control edges for ${nodeId}: expected $($expectedCount.outgoing), found $($drawioOutgoing.Count)"
        }
        if ($mermaidOutgoing.Count -ne [int] $expectedCount.outgoing) {
            $pageErrors += "Mermaid outgoing control edges for ${nodeId}: expected $($expectedCount.outgoing), found $($mermaidOutgoing.Count)"
        }
        $controlEdgeCountResults += [pscustomobject]@{
            node = $nodeId
            expectedOutgoing = [int] $expectedCount.outgoing
            drawioOutgoing = $drawioOutgoing.Count
            mermaidOutgoing = $mermaidOutgoing.Count
            drawioTargets = @($drawioOutgoing | ForEach-Object { "$($_.target) [$($_.guard)]" })
            rationale = $expectedCount.rationale
        }
    }

    # Detached side flows: the chain must exist, must not touch the main control path,
    # and must reach the decision only through a dashed information edge.
    $sideFlowResults = @()
    foreach ($sideFlow in $page.detachedSideFlows) {
        $chain = @($sideFlow.chain)
        $chainErrors = @()
        for ($link = 0; $link -lt $chain.Count - 1; $link++) {
            $expectedLink = [pscustomobject]@{ source = $chain[$link]; target = $chain[$link + 1]; guard = '' }
            if (-not (Test-Edge $graph.controlEdges $expectedLink)) { $chainErrors += "drawio chain edge missing: $($chain[$link]) -> $($chain[$link + 1])" }
            if (-not (Test-Edge $mermaidEdges $expectedLink)) { $chainErrors += "Mermaid chain edge missing: $($chain[$link]) -> $($chain[$link + 1])" }
        }
        foreach ($edge in $graph.controlEdges) {
            if (($chain -contains $edge.source) -ne ($chain -contains $edge.target)) {
                $chainErrors += "not detached: control edge $($edge.source) -> $($edge.target) crosses the side-flow boundary"
            }
        }
        $informationEdge = $sideFlow.informationEdge
        $dashedMatches = @($graph.cells | Where-Object {
            $_.edge -eq '1' -and [string] $_.source -eq [string] $informationEdge.source -and [string] $_.target -eq [string] $informationEdge.target -and ([string] $_.style) -match 'dashed=1'
        })
        if ($dashedMatches.Count -lt 1) { $chainErrors += "dashed information edge missing in drawio: $($informationEdge.source) -> $($informationEdge.target)" }
        if (@($graph.controlEdges | Where-Object { $_.source -eq [string] $informationEdge.source -and $_.target -eq [string] $informationEdge.target }).Count -gt 0) {
            $chainErrors += "information edge drawn as a control edge: $($informationEdge.source) -> $($informationEdge.target)"
        }
        $mermaidInformationPattern = '(?m)^\s*' + [regex]::Escape([string] $informationEdge.source) + '\s+-\.->\s*(?:\|[^|]*\|)?\s*' + [regex]::Escape([string] $informationEdge.target) + '\s*$'
        if (-not [regex]::IsMatch($mermaid, $mermaidInformationPattern)) {
            $chainErrors += "Mermaid information edge missing or not dashed: $($informationEdge.source) -.-> $($informationEdge.target)"
        }
        $pageErrors += $chainErrors | ForEach-Object { "side flow $($sideFlow.id): $_" }
        $sideFlowResults += [pscustomobject]@{
            id = $sideFlow.id
            chain = $chain
            informationEdge = "$($informationEdge.source) -.-> $($informationEdge.target)"
            status = if ($chainErrors.Count -eq 0) { 'pass' } else { 'fail' }
            errors = $chainErrors
            rationale = $sideFlow.rationale
        }
    }

    # Note assertions: nội dung normative của note phải giữ đúng thẩm quyền và không được
    # lệch giữa Mermaid, source rời và tệp gộp (finding QĐ30-R01).
    $noteResults = @()
    foreach ($note in $page.noteAssertions) {
        $noteErrors = @()
        $drawioText = $null
        if (-not $graph.cellById.ContainsKey($note.id)) {
            $noteErrors += "note thiếu trong drawio: $($note.id)"
        } else {
            $drawioText = Normalize-Text $graph.cellById[$note.id].value
            foreach ($forbidden in $note.mustNotContain) {
                $needle = (Normalize-Text $forbidden).ToLowerInvariant()
                if ($drawioText.ToLowerInvariant().Contains($needle)) {
                    $noteErrors += "drawio note $($note.id) còn wording đã bị loại: '$forbidden'"
                }
                # Quét substring trên text đã giải mã HTML nhưng CHƯA strip tag, nên không phụ thuộc
                # vị trí chuỗi trong thuộc tính XML.
                if ($combinedRawDecoded -and $combinedRawDecoded.ToLowerInvariant().Contains($needle)) {
                    $noteErrors += "tệp gộp còn wording đã bị loại: '$forbidden'"
                }
            }
            foreach ($required in $note.mustContain) {
                if (-not $drawioText.Contains((Normalize-Text $required))) {
                    $noteErrors += "drawio note $($note.id) thiếu wording bắt buộc: '$required'"
                }
            }
        }

        $mermaidText = Get-MermaidNodeLabel $mermaid $note.id
        if ($null -eq $mermaidText) {
            $noteErrors += "note thiếu trong Mermaid: $($note.id)"
        } elseif ($note.matchMermaid -and $null -ne $drawioText -and $mermaidText -ne $drawioText) {
            $noteErrors += "note $($note.id) lệch giữa Mermaid và drawio; Mermaid='$mermaidText'; drawio='$drawioText'"
        }

        if ($null -ne $drawioText -and $combinedCellsByPage.Count -gt 0) {
            $combinedCells = Get-CombinedCells $page.id
            if ($null -eq $combinedCells) {
                $noteErrors += "tệp gộp không có trang $($page.id)"
            } elseif (-not $combinedCells.ContainsKey($note.id)) {
                $noteErrors += "tệp gộp thiếu note $($note.id) ở trang $($page.id)"
            } else {
                $combinedNoteText = Normalize-Text $combinedCells[$note.id].value
                if ($combinedNoteText -ne $drawioText) {
                    $noteErrors += "note $($note.id) lệch giữa source rời và tệp gộp; gộp='$combinedNoteText'"
                }
            }
        }

        $pageErrors += $noteErrors
        $noteResults += [pscustomobject]@{
            id = $note.id
            rule = $note.rule
            status = if ($noteErrors.Count -eq 0) { 'pass' } else { 'fail' }
            drawioText = $drawioText
            mermaidText = $mermaidText
            errors = $noteErrors
            rationale = $note.rationale
        }
    }

    foreach ($final in $page.finals) {
        if (-not $graph.cellById.ContainsKey($final.id)) {
            $pageErrors += "drawio final missing: $($final.id)"
            continue
        }
        $cell = $graph.cellById[$final.id]
        if ((Get-CellType $cell) -ne $final.kind) { $pageErrors += "drawio final kind differs: $($final.id)" }
        if (@($graph.controlEdges | Where-Object { $_.source -eq $final.id }).Count -ne 0) { $pageErrors += "drawio final has outgoing control edge: $($final.id)" }
        if (-not [regex]::IsMatch($mermaid, '(?m)^\s*' + [regex]::Escape($final.id) + '\s*(?:\[|\{|\(|>)')) { $pageErrors += "Mermaid final missing: $($final.id)" }
    }

    $pageResults += [pscustomobject]@{
        page = $page.id
        source = $page.source
        sourceSha256 = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash
        status = if ($pageErrors.Count -eq 0) { 'pass' } else { 'fail' }
        errors = $pageErrors
        canonicalNodes = $page.nodes
        expectedEdges = $page.edges
        controlEdgeCounts = $controlEdgeCountResults
        detachedSideFlows = $sideFlowResults
        noteAssertions = $noteResults
        finals = $page.finals
        allowedPresentationExceptions = $page.allowedPresentationExceptions
    }
    $errors += $pageErrors | ForEach-Object { "$($page.id): $_" }
}

$duplicateResults = @()
foreach ($file in Get-ChildItem -LiteralPath $drawioDirectory -Filter 'WF-*.drawio' -File | Sort-Object Name) {
    $graph = Get-Graph $file.FullName
    $vertices = @()
    foreach ($cell in ($graph.cells | Where-Object { $_.vertex -eq '1' })) {
        $style = [string] $cell.style
        if ($style -match 'swimlane|shape=note|^text;') { continue }
        $geometry = $cell.mxGeometry
        $vertices += [pscustomobject]@{
            id = [string] $cell.id
            parent = [string] $cell.parent
            type = Get-CellType $cell
            label = Normalize-Text $cell.value
            bounds = @([double] $geometry.x, [double] $geometry.y, [double] $geometry.width, [double] $geometry.height)
            incoming = @($graph.controlEdges | Where-Object { $_.target -eq $cell.id } | ForEach-Object { $_.source })
            outgoing = @($graph.controlEdges | Where-Object { $_.source -eq $cell.id } | ForEach-Object { $_.target })
        }
    }
    $candidates = @(Get-DuplicateCandidates -Vertices $vertices)
    $duplicateResults += [pscustomobject]@{
        page = $file.BaseName
        sourceSha256 = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
        candidateCount = $candidates.Count
        candidates = $candidates
    }
    if ($candidates.Count -gt 0) { $errors += "$($file.BaseName): semantic duplicate candidate(s) found" }
}

$fixtureResult = $null
if (-not $SkipRegressionFixture) {
    $fixture = Get-Content -LiteralPath $fixturePath -Raw -Encoding utf8 | ConvertFrom-Json
    $fixtureCandidates = @(Get-DuplicateCandidates -Vertices @($fixture.vertices))
    $fixtureResult = [pscustomobject]@{
        path = (Resolve-Path -LiteralPath $fixturePath).Path
        expectedDuplicateCandidates = $fixture.expectedDuplicateCandidates
        actualDuplicateCandidates = $fixtureCandidates.Count
        status = if ($fixtureCandidates.Count -eq $fixture.expectedDuplicateCandidates) { 'pass' } else { 'fail' }
    }
    if ($fixtureResult.status -ne 'pass') { $errors += 'WF-15 regression fixture did not trigger the duplicate detector' }
}

$result = [pscustomobject]@{
    generatedAt = (Get-Date).ToString('o')
    checker = [pscustomobject]@{
        path = (Resolve-Path -LiteralPath $PSCommandPath).Path
        sha256 = (Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash
        scope = $manifest.scope
    }
    inputs = [pscustomobject]@{
        index = [pscustomobject]@{ path = (Resolve-Path -LiteralPath $indexPath).Path; sha256 = (Get-FileHash -LiteralPath $indexPath -Algorithm SHA256).Hash }
        manifest = [pscustomobject]@{ path = (Resolve-Path -LiteralPath $ManifestPath).Path; sha256 = (Get-FileHash -LiteralPath $ManifestPath -Algorithm SHA256).Hash }
        drawioSourcesScanned = $duplicateResults.Count
    }
    status = if ($errors.Count -eq 0) { 'pass' } else { 'fail' }
    pageResults = $pageResults
    duplicateSemanticCells = $duplicateResults
    regressionFixture = $fixtureResult
    manualRequired = $manifest.manualRequired
    errors = $errors
}

$parentDirectory = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Force -Path $parentDirectory | Out-Null
[IO.File]::WriteAllText($OutputPath, ($result | ConvertTo-Json -Depth 12), [Text.UTF8Encoding]::new($false))
Write-Output "status=$($result.status) pages=$($pageResults.Count) scanned=$($duplicateResults.Count) output=$OutputPath"
if ($result.status -ne 'pass') { exit 1 }
