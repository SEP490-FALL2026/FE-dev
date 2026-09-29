figma.showUI(__html__, { width: 480, height: 620 })

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'NOTIFY') {
    figma.notify(msg.message, { error: !!msg.isError })
    return
  }

  if (msg.type === 'IMPORT_FRAMES') {
    const items = msg.data || []
    if (items.length === 0) {
      figma.notify('Không có frame nào được gửi để import.', { error: true })
      return
    }

    figma.notify(`Đang xử lý tạo ${items.length} frames lên canvas...`)

    // Load fonts for section headers and labels
    try {
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
      await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })
    } catch (e) {
      console.warn('Inter font not available, fallback to default font')
    }

    // Group items by flow
    const flows = {}
    for (const item of items) {
      if (!flows[item.flow]) {
        flows[item.flow] = {
          title: item.flowTitle || item.flow,
          screens: {}
        }
      }
      const key = `${item.theme}_${item.screenId}`
      flows[item.flow].screens[key] = item
    }

    const FRAME_WIDTH = 1440
    const FRAME_HEIGHT = 1024
    const GAP_X = 100
    const GAP_Y = 160
    const SECTION_GAP_Y = 400

    let currentSectionY = 0
    const createdNodes = []

    const flowKeys = Object.keys(flows).sort()

    for (const flowKey of flowKeys) {
      const flowData = flows[flowKey]

      // Identify all unique screenIds in this flow
      const screenIdSet = new Set()
      Object.values(flowData.screens).forEach((item) => screenIdSet.add(item.screenId))
      const sortedScreenIds = Array.from(screenIdSet).sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

      const totalCols = Math.max(sortedScreenIds.length, 1)
      const sectionWidth = 100 + totalCols * (FRAME_WIDTH + GAP_X)
      const sectionHeight = 2800 // ample height for 2 rows + labels

      // Try creating Figma Section, fallback to Group/Frame
      let container
      let isSection = false
      try {
        container = figma.createSection()
        container.name = flowData.title
        container.x = 0
        container.y = currentSectionY
        container.resizeWithoutConstraints(sectionWidth, sectionHeight)
        isSection = true
      } catch (e) {
        // Fallback to normal Frame
        container = figma.createFrame()
        container.name = flowData.title
        container.x = 0
        container.y = currentSectionY
        container.resize(sectionWidth, sectionHeight)
        container.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.96, b: 0.98 } }]
      }

      createdNodes.push(container)

      // Add Row 1 Label: Light Theme
      try {
        const labelLight = figma.createText()
        labelLight.characters = `☀️ LIGHT THEME — ${flowData.title} (${sortedScreenIds.length} MÀN HÌNH)`
        labelLight.fontSize = 28
        labelLight.fontName = { family: 'Inter', style: 'Bold' }
        labelLight.x = 80
        labelLight.y = 60
        container.appendChild(labelLight)
      } catch (e) {}

      // Add Row 2 Label: Dark Theme
      try {
        const labelDark = figma.createText()
        labelDark.characters = `🌙 DARK THEME — ${flowData.title} (${sortedScreenIds.length} MÀN HÌNH)`
        labelDark.fontSize = 28
        labelDark.fontName = { family: 'Inter', style: 'Bold' }
        labelDark.x = 80
        labelDark.y = 1260
        container.appendChild(labelDark)
      } catch (e) {}

      // Place frames
      for (let col = 0; col < sortedScreenIds.length; col++) {
        const screenId = sortedScreenIds[col]
        const posX = 80 + col * (FRAME_WIDTH + GAP_X)

        // Light frame
        const lightKey = `Light_${screenId}`
        const lightItem = flowData.screens[lightKey]
        if (lightItem && lightItem.bytes) {
          const frameLight = figma.createFrame()
          frameLight.resize(FRAME_WIDTH, FRAME_HEIGHT)
          frameLight.name = `${flowKey}-Light-${screenId}: ${lightItem.title || 'Screen ' + screenId}`
          frameLight.x = posX
          frameLight.y = 120

          const image = figma.createImage(new Uint8Array(lightItem.bytes))
          frameLight.fills = [
            {
              type: 'IMAGE',
              scaleMode: 'FILL',
              imageHash: image.hash
            }
          ]

          container.appendChild(frameLight)
          createdNodes.push(frameLight)
        }

        // Dark frame
        const darkKey = `Dark_${screenId}`
        const darkItem = flowData.screens[darkKey]
        if (darkItem && darkItem.bytes) {
          const frameDark = figma.createFrame()
          frameDark.resize(FRAME_WIDTH, FRAME_HEIGHT)
          frameDark.name = `${flowKey}-Dark-${screenId}: ${darkItem.title || 'Screen ' + screenId}`
          frameDark.x = posX
          frameDark.y = 1320

          const image = figma.createImage(new Uint8Array(darkItem.bytes))
          frameDark.fills = [
            {
              type: 'IMAGE',
              scaleMode: 'FILL',
              imageHash: image.hash
            }
          ]

          container.appendChild(frameDark)
          createdNodes.push(frameDark)
        }
      }

      currentSectionY += sectionHeight + SECTION_GAP_Y
    }

    // Scroll and zoom canvas into view
    if (createdNodes.length > 0) {
      figma.viewport.scrollAndZoomIntoView(createdNodes)
    }

    figma.notify(`🎉 Đã import thành công ${items.length} frame lên Figma Canvas!`, { timeout: 6000 })
    figma.ui.postMessage({ type: 'IMPORT_COMPLETE', count: items.length })
  }

  if (msg.type === 'CLOSE') {
    figma.closePlugin()
  }
}
