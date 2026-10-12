"""Traceability data of the single use case model (source for generated tables and checks).

Codes are owned elsewhere: FR/SoD/INV -> BRD; F/BR/UF -> User Flows; WF -> Workflows;
US -> User Stories; QĐ -> decision log; DQ -> decision checkpoint. This file only
records which of those codes each use case traces to, plus the Owner decisions of the
25/09/2026 sessions that the model applies.
"""


def r(prefix, a, b, fmt="{:02d}"):
    """Expand a numeric range such as r('BR-45.', 1, 8)."""
    return [f"{prefix}{fmt.format(i) if fmt else i}" for i in range(a, b + 1)]


def brs(flow, a, b):
    return [f"BR-{flow:02d}.{i}" for i in range(a, b + 1)]


def us(epic, a, b):
    return [f"US-{epic:02d}-{i:02d}" for i in range(a, b + 1)]


TRACE = {
    "UC01": dict(FR=["FR-8.1", "FR-8.9", "FR-8.11"], RULE=["SoD-4"], BR=[], F=[], WF=[], UF=["UF-13"], US=["US-01-01", "US-01-10"], DEC=["QĐ-46"]),
    "UC02": dict(FR=["FR-8.1", "FR-8.5", "FR-8.6"], RULE=["SoD-1"], BR=["BR-37.1"], F=["F-37"], WF=["WF-03"], UF=["UF-13"],
                 US=["US-01-01", "US-01-02", "US-01-05", "US-01-10"], DEC=["QĐ-46"]),
    "UC03": dict(FR=["FR-3.5", "FR-3.6", "FR-3.8", "FR-3.12", "FR-3.13", "FR-3.15", "FR-3.16", "FR-4.13", "FR-4.17",
                     "FR-8.2", "FR-10.3"],
                 RULE=["SoD-1"], BR=["BR-06.5", "BR-13.8", "BR-13.9", "BR-13.10", "BR-13.11", "BR-13.12", "BR-20.1",
                                     "BR-36.8", "BR-37.2", "BR-44.5", "BR-45.5"],
                 F=["F-13", "F-37", "F-44"], WF=["WF-03"], UF=["UF-13"], US=["US-01-03", "US-01-04", "US-01-08"],
                 DEC=["QĐ-02", "QĐ-27", "QĐ-28c", "QĐ-28d", "OI-14a", "OI-14b", "OI-11b", "OI-17"]),
    "UC04": dict(FR=["FR-8.3"], RULE=["SoD-1", "INV-05"], BR=["BR-38.1", "BR-38.3", "BR-41.3", "BR-44.3"],
                 F=["F-38"], WF=["WF-03"], UF=[], US=["US-01-06"], DEC=["OI-08c"]),
    "UC05": dict(FR=["FR-8.4", "FR-10.3", "FR-10.6"], RULE=["SoD-1"],
                 BR=["BR-38.2", "BR-41.1", "BR-41.2", "BR-44.1", "BR-44.2", "BR-44.4"],
                 F=["F-38", "F-41", "F-44"], WF=["WF-03"], UF=[], US=["US-01-07", "US-14-03", "US-14-04"], DEC=[]),
    "UC06": dict(FR=r("FR-9.", 1, 7, "{}"), RULE=["INV-14b"],
                 BR=["BR-01.1", "BR-01.2", "BR-01.4", "BR-01.5", "BR-01.6", "BR-01.7"],
                 F=["F-01", "F-19"], WF=["WF-01"], UF=["UF-06"], US=us(2, 2, 6), DEC=["OI-04", "OI-10"]),
    "UC07": dict(FR=["FR-2.1", "FR-2.2", "FR-2.8", "FR-3.1", "FR-3.16", "FR-9.7"],
                 RULE=["INV-07", "INV-14a", "INV-14b"],
                 BR=["BR-01.6", "BR-03.1", "BR-03.2", "BR-03.3", "BR-03.4", "BR-04.2", "BR-04.3", "BR-05.3",
                     "BR-39.1", "BR-39.3"],
                 F=["F-02", "F-03", "F-04", "F-39"], WF=["WF-04", "WF-05", "WF-06", "WF-08"], UF=["UF-01"],
                 US=["US-02-02", "US-02-03", "US-03-01", "US-03-03", "US-03-05"], DEC=["QĐ-23", "QĐ-28d", "OI-04"]),
    "UC08": dict(FR=["FR-1.7", "FR-2.4", "FR-4.18", "FR-10.6"], RULE=["SoD-5", "SoD-6", "INV-06"],
                 BR=["BR-05.1", "BR-05.2", "BR-05.3", "BR-05.4", "BR-05.5", "BR-05.6", "BR-06.7", "BR-41.1",
                     "BR-41.2", "BR-41.3", "BR-41.4", "BR-45.7"],
                 F=["F-05", "F-41"], WF=["WF-07", "WF-09a"], UF=["UF-08", "UF-09"],
                 US=["US-03-04", "US-07-05", "US-09-08", "US-14-03"], DEC=["OI-05c", "OI-14c", "QĐ-41a", "QĐ-48a", "QĐ-48b", "QĐ-48c"]),
    "UC09": dict(FR=["FR-1.1", "FR-1.2", "FR-1.7", "FR-1.8", "FR-6.1", "FR-6.2"], RULE=["INV-06"],
                 BR=["BR-06.1", "BR-06.2", "BR-06.3", "BR-06.4", "BR-06.6", "BR-06.7", "BR-06.9"],
                 F=["F-06", "F-34"], WF=["WF-02"], UF=["UF-12"], US=["US-04-01", "US-04-02", "US-04-06", "US-04-07"],
                 DEC=["ADR-05", "OI-05b", "OI-05c", "OI-14e"]),
    "UC10": dict(FR=["FR-1.3", "FR-1.4", "FR-1.5", "FR-1.6", "FR-4.15", "FR-5.6"], RULE=["INV-01", "INV-04"],
                 BR=["BR-06.8", "BR-27.1", "BR-27.2", "BR-27.3", "BR-27.5", "BR-29.1"],
                 F=["F-06", "F-27"], WF=["WF-02", "WF-15"], UF=["UF-11", "UF-15"],
                 US=["US-04-03", "US-04-04", "US-04-05", "US-11-03"], DEC=["QĐ-16", "QĐ-18", "ADR-06", "OI-11c"]),
    "UC11": dict(FR=["FR-2.8", "FR-3.2", "FR-3.3", "FR-3.4", "FR-3.11", "FR-3.12"], RULE=["SoD-4", "INV-02", "INV-08"],
                 BR=["BR-02.1", "BR-02.2", "BR-02.3", "BR-07.1", "BR-07.2", "BR-07.3", "BR-07.4", "BR-07.11",
                     "BR-12.5", "BR-15.1", "BR-39.1", "BR-39.4"],
                 F=["F-02", "F-07", "F-08", "F-09", "F-15", "F-39"], WF=["WF-08", "WF-09", "WF-10", "WF-11"],
                 UF=["UF-01", "UF-02", "UF-04"],
                 US=["US-03-02", "US-03-05", "US-05-01", "US-05-02", "US-05-03", "US-05-08", "US-05-14", "US-05-15"],
                 DEC=["QĐ-29a", "OI-06", "OI-07a"]),
    "UC13": dict(FR=["FR-2.4", "FR-3.2"], RULE=[], BR=["BR-14.1", "BR-14.2"], F=["F-14"], WF=["WF-11"],
                 UF=["UF-08", "UF-09"], US=["US-05-13", "US-07-05"], DEC=["OI-07b"]),
    "UC14": dict(FR=["FR-3.3", "FR-3.6", "FR-3.7", "FR-3.8", "FR-3.12", "FR-3.16"], RULE=["SoD-2", "SoD-4", "INV-08"],
                 BR=["BR-02.2", "BR-03.4", "BR-07.4", "BR-07.5", "BR-07.7", "BR-07.8", "BR-13.2", "BR-13.4", "BR-13.6",
                     "BR-13.8", "BR-13.9", "BR-13.11", "BR-15.1", "BR-39.4"],
                 F=["F-07", "F-08", "F-09", "F-13", "F-15"], WF=["WF-09", "WF-10"], UF=["UF-01", "UF-04", "UF-13"],
                 US=["US-05-04", "US-05-05", "US-05-09", "US-05-10", "US-05-11", "US-05-12"],
                 DEC=["QĐ-02", "QĐ-13", "QĐ-27", "QĐ-28d", "QĐ-29a", "OI-07a", "OI-14a", "OI-14e"]),
    "UC15": dict(FR=["FR-3.4"], RULE=["SoD-5"], BR=["BR-09.1", "BR-09.2", "BR-09.3"], F=["F-09"], WF=["WF-10"],
                 UF=["UF-02"], US=["US-05-06"], DEC=["QĐ-22", "OI-05a", "OI-14e"]),
    "UC16": dict(FR=["FR-3.4", "FR-3.13", "FR-3.14", "FR-3.15", "FR-5.8", "FR-5.8a"], RULE=["SoD-7", "INV-16", "INV-18"],
                 BR=["BR-07.6", "BR-07.10", "BR-09.4", "BR-36.1", "BR-36.3"],
                 F=["F-08", "F-09", "F-15"], WF=["WF-09", "WF-10"], UF=["UF-15"],
                 US=["US-05-07", "US-06-01", "US-06-04", "US-06-07", "US-06-08"], DEC=["QĐ-22", "QĐ-29b", "QĐ-30b"]),
    "UC17": dict(FR=["FR-3.14"], RULE=["SoD-8"], BR=["BR-07.9"], F=["F-08", "F-09", "F-27"],
                 WF=["WF-09", "WF-10", "WF-15"], UF=["UF-15"], US=["US-06-02"], DEC=["QĐ-29b", "QĐ-30a"]),
    "UC20": dict(FR=["FR-3.14", "FR-5.1", "FR-5.6", "FR-5.8", "FR-5.8a"], RULE=["SoD-3", "SoD-8", "INV-16", "INV-18"],
                 BR=["BR-07.9", "BR-07.10", "BR-07.11", "BR-29.1", "BR-29.7", "BR-36.1", "BR-36.2", "BR-36.3",
                     "BR-36.4", "BR-36.5", "BR-36.6", "BR-36.7", "BR-36.8"],
                 F=["F-08", "F-09", "F-29", "F-36"], WF=["WF-09", "WF-10", "WF-15"], UF=["UF-11", "UF-15"],
                 US=["US-06-03", "US-06-04", "US-06-05", "US-06-06", "US-06-07", "US-06-09"],
                 DEC=["QĐ-29b", "QĐ-30b", "OI-11a", "OI-11b"]),
    "UC21": dict(FR=["FR-2.3", "FR-2.5", "FR-2.7", "FR-3.11"], RULE=["SoD-5", "SoD-6", "INV-01", "INV-02"],
                 BR=["BR-07.3", "BR-10.1", "BR-10.2", "BR-10.3", "BR-10.4", "BR-12.1", "BR-12.2", "BR-12.3", "BR-12.4",
                     "BR-12.5", "BR-34.2"],
                 F=["F-07", "F-08", "F-09", "F-10", "F-11", "F-12", "F-15", "F-34", "F-39"], WF=["WF-09a"],
                 UF=["UF-01", "UF-08", "UF-14"],
                 US=["US-05-07", "US-05-15", "US-07-01", "US-07-02", "US-07-03", "US-07-04"], DEC=["QĐ-03"]),
    "UC22": dict(FR=["FR-2.4", "FR-2.5", "FR-4.15"], RULE=["SoD-5", "SoD-6"],
                 BR=["BR-05.4", "BR-10.1", "BR-10.2", "BR-10.3", "BR-10.4", "BR-12.1", "BR-12.2", "BR-12.3", "BR-12.4",
                     "BR-14.1", "BR-14.2", "BR-22.1", "BR-22.2", "BR-39.2"],
                 F=["F-05", "F-12", "F-14", "F-22", "F-34", "F-39"],
                 WF=["WF-07", "WF-09a", "WF-11", "WF-13", "WF-17"], UF=["UF-08", "UF-09", "UF-10"],
                 US=["US-07-05", "US-10-07"], DEC=["OI-02"]),
    "UC23": dict(FR=["FR-2.6", "FR-4.8", "FR-7.7"], RULE=[],
                 BR=["BR-28.1", "BR-28.2", "BR-28.3", "BR-43.1", "BR-43.2", "BR-43.3"],
                 F=["F-12", "F-28", "F-43"], WF=["WF-16"], UF=["UF-14"], US=["US-07-06", "US-07-07"],
                 DEC=["QĐ-15", "OI-14h"]),
    "UC24": dict(FR=r("FR-4.", 1, 8, "{}") + ["FR-4.11", "FR-4.16", "FR-7.7"], RULE=["INV-10", "INV-11", "INV-12"],
                 BR=["BR-17.1", "BR-17.4", "BR-17.5", "BR-17.6", "BR-17.8", "BR-17.9", "BR-18.1", "BR-18.2",
                     "BR-18.3", "BR-18.4", "BR-43.1"],
                 F=["F-17", "F-18", "F-20", "F-43"], WF=["WF-12", "WF-12a"], UF=["UF-06", "UF-07"],
                 US=["US-08-01", "US-08-02", "US-08-03", "US-08-04", "US-08-06", "US-08-07"],
                 DEC=["QĐ-21", "QĐ-28a"]),
    "UC26": dict(FR=["FR-4.3a", "FR-4.14a", "FR-4.17", "FR-4.18", "FR-4.19", "FR-4.20"], RULE=["INV-17"],
                 BR=["BR-17.9"] + brs(45, 1, 8) + ["BR-46.1"],
                 F=["F-20", "F-45", "F-46", "F-48"], WF=["WF-18"], UF=["UF-09", "UF-12", "UF-16"],
                 US=["US-09-01", "US-09-02", "US-09-05", "US-09-06", "US-09-07", "US-09-08", "US-09-09", "US-13-04", "US-08-08"],
                 DEC=["QĐ-20", "QĐ-28b", "DQ-03", "DQ-04", "OI-14b", "OI-14d", "BF-05", "QĐ-31b", "QĐ-32c"]),
    "UC27": dict(FR=["FR-4.18", "FR-10.4"], RULE=["INV-17"], BR=["BR-42.4", "BR-42.5", "BR-45.1", "BR-45.8"],
                 F=["F-42", "F-45"], WF=["WF-18"], UF=["UF-16"], US=["US-09-03"], DEC=["QĐ-20"]),
    "UC28": dict(FR=["FR-3.10"] + r("FR-4.", 9, 15, "{}") + ["FR-4.12b", "FR-4.14a"], RULE=["INV-09", "INV-12"],
                 BR=["BR-04.1", "BR-05.1", "BR-05.2", "BR-06.4", "BR-19.1", "BR-19.2"] + brs(20, 1, 7)
                 + brs(21, 1, 6) + ["BR-22.1", "BR-23.1"],
                 F=["F-04", "F-19", "F-20", "F-21", "F-23"], WF=["WF-13", "WF-13a"], UF=["UF-05", "UF-09", "UF-10"],
                 US=us(10, 1, 8), DEC=["QĐ-09", "DQ-03", "OI-02", "OI-12a", "OI-12b", "BF-03"]),
    "UC29": dict(FR=["FR-1.4", "FR-3.13"], RULE=[], BR=["BR-26.1", "BR-26.2", "BR-26.3", "BR-26.4", "BR-42.7"],
                 F=["F-26"], WF=["WF-15"], UF=["UF-11"], US=["US-11-01", "US-11-04"],
                 DEC=["DQ-07", "OI-EMAIL", "OI-09a", "OI-09b", "OI-05c"]),
    "UC30": dict(FR=["FR-1.4", "FR-3.13", "FR-3.14"], RULE=["SoD-7"], BR=["BR-26.3", "BR-27.4", "BR-27.5"],
                 F=["F-27"], WF=["WF-15"], UF=["UF-10", "UF-15"], US=["US-11-02"], DEC=["QĐ-22", "DQ-07", "OI-11c"]),
    "UC32": dict(FR=["FR-1.5", "FR-5.4", "FR-5.6", "FR-5.8", "FR-7.7"], RULE=["SoD-3", "INV-04"],
                 BR=["BR-06.8", "BR-29.1", "BR-35.1", "BR-35.2", "BR-36.2", "BR-36.7", "BR-43.1", "BR-43.2", "BR-43.3"],
                 F=["F-06", "F-35", "F-43"], WF=["WF-16"], UF=["UF-11", "UF-14"],
                 US=["US-04-04", "US-04-05", "US-06-06", "US-07-07", "US-12-02"], DEC=["QĐ-19", "OI-11a"]),
    "UC33": dict(FR=["FR-3.1", "FR-5.2", "FR-9.7"], RULE=["INV-03", "INV-14b"],
                 BR=["BR-01.6", "BR-29.3", "BR-29.4", "BR-29.9"], F=["F-01", "F-29"], WF=[], UF=[],
                 US=["US-04-08", "US-04-09"], DEC=["QĐ-23", "QĐ-30c", "OI-03", "OI-04"]),
    "UC36": dict(FR=["FR-5.5", "FR-5.6", "FR-5.7"], RULE=[], BR=["BR-30.1", "BR-30.2", "BR-30.3"], F=["F-30"], WF=[],
                 UF=[], US=["US-12-03"], DEC=["QĐ-25", "ADR-09"]),
    "UC42": dict(FR=r("FR-6.", 3, 9, "{}"), RULE=["INV-13"],
                 BR=brs(31, 1, 6) + brs(46, 1, 3), F=["F-31", "F-32", "F-46"], WF=["WF-17", "WF-17a"], UF=["UF-12"],
                 US=["US-13-01", "US-13-02", "US-13-03", "US-13-04", "US-13-05", "US-15-01"],
                 DEC=["QĐ-20", "DQ-06", "OI-14e", "OI-14f", "QĐ-31a", "QĐ-32a", "QĐ-32b"]),
    "UC43": dict(FR=["FR-3.4", "FR-3.4c-1", "FR-6.9"], RULE=["SoD-5", "SoD-7"],
                 BR=["BR-09.4", "BR-34.1", "BR-34.2", "BR-34.3"], F=["F-34"], WF=["WF-17"], UF=["UF-12"],
                 US=["US-13-06"], DEC=["DQ-06", "BF-01", "OI-14g"]),
    "UC44": dict(FR=["FR-3.11", "FR-4.18", "FR-10.1", "FR-10.2", "FR-10.5", "FR-10.7"], RULE=[],
                 BR=["BR-40.1", "BR-40.2", "BR-40.3", "BR-40.5", "BR-40.7", "BR-42.6"],
                 F=["F-40", "F-44", "F-45"], WF=[], UF=["UF-01", "UF-03"],
                 US=["US-05-15", "US-09-04", "US-14-01", "US-14-02", "US-14-05", "US-14-06"], DEC=["OI-01b", "OI-13"]),
    "UC47": dict(FR=["FR-4.18", "FR-10.2", "FR-10.5", "FR-10.7"], RULE=[],
                 BR=["BR-40.2", "BR-40.4", "BR-40.5", "BR-40.6", "BR-40.7", "BR-40.8"], F=["F-40"], WF=[],
                 UF=["UF-03"], US=["US-09-04", "US-14-02", "US-14-06"],
                 DEC=["OI-01", "OI-01a", "OI-01b", "OI-01c", "OI-13", "OI-13b"]),
    "UC48": dict(FR=["FR-4.18", "FR-10.4"], RULE=[], BR=["BR-42.1", "BR-42.2", "BR-42.3", "BR-42.7"],
                 F=["F-42"], WF=["WF-12", "WF-18"], UF=["UF-06", "UF-16"], US=["US-08-05", "US-09-03"],
                 DEC=["QĐ-01", "QĐ-20", "OI-EMAIL", "OI-09b", "BF-07"]),
    "UC54": dict(FR=r("FR-7.", 1, 6, "{}") + ["FR-2.1", "FR-4.1", "FR-5.4", "FR-6.3", "FR-6.4", "FR-9.2"], RULE=[],
                 BR=["BR-01.3", "BR-17.2", "BR-17.3", "BR-17.7", "BR-31.4"],
                 F=["F-01", "F-17", "F-31", "F-32", "F-35"], WF=["WF-01", "WF-12", "WF-16", "WF-17a"],
                 UF=["UF-06", "UF-12"], US=["US-02-01", "US-06-09", "US-08-02", "US-12-02", "US-13-01", "US-13-02"],
                 DEC=[]),
    "UC55": dict(FR=["FR-1.5", "FR-3.5", "FR-3.8", "FR-3.13", "FR-3.14", "FR-3.15"], RULE=["SoD-7", "SoD-8"],
                 BR=["BR-06.8", "BR-07.8", "BR-07.9", "BR-13.2", "BR-13.10", "BR-13.11", "BR-36.3"],
                 F=["F-08", "F-09", "F-13", "F-27", "F-34"], WF=["WF-09", "WF-10", "WF-15", "WF-17"], UF=["UF-15"],
                 US=["US-04-04", "US-06-01", "US-06-08", "US-11-02", "US-13-06"],
                 DEC=["QĐ-22", "QĐ-27", "QĐ-28c", "QĐ-29b", "QĐ-30a", "OI-08a", "OI-11d", "OI-14a"]),
    "UC56": dict(FR=r("FR-0.", 1, 4, "{}") + ["FR-3.8", "FR-3.9", "FR-4.14a", "FR-4.15", "FR-5.1", "FR-5.2", "FR-5.3",
                                                "FR-5.6", "FR-5.8a", "FR-5.9", "FR-5.10", "FR-5.10a", "FR-5.11", "FR-5.12"],
                 RULE=["SoD-2"],
                 BR=["BR-06.4", "BR-20.2", "BR-22.2", "BR-27.2", "BR-29.1", "BR-29.2", "BR-29.5", "BR-29.6", "BR-29.7",
                     "BR-29.8", "BR-36.6", "BR-45.6"] + brs(47, 1, 4),
                 F=["F-13", "F-22", "F-29", "F-47"], WF=[], UF=["UF-04", "UF-13", "UF-15"],
                 US=["US-05-09", "US-05-10", "US-05-15", "US-12-01", "US-12-04", "US-12-05", "US-12-06", "US-12-07"],
                 DEC=["QĐ-24", "QĐ-29a", "DQ-05", "KPI3-DENOM", "OI-08b"]),
    # deferred / design-only (not on the diagram)
    "UC49": dict(FR=["FR-3.2"], RULE=[], BR=[], F=["F-16"], WF=["WF-11"], UF=[], US=["US-05-16"], DEC=["QĐ-25"]),
    "UC50": dict(FR=["FR-3.10"], RULE=[], BR=[], F=["F-24"], WF=["WF-14"], UF=[], US=["US-10-09"], DEC=[]),
    "UC51": dict(FR=["FR-4.19"], RULE=[], BR=[], F=["F-48"], WF=[], UF=[], US=["US-09-09"], DEC=["QĐ-20"]),
    "UC52": dict(FR=["FR-5.7"], RULE=[], BR=[], F=["F-30"], WF=[], UF=[], US=["US-12-08"], DEC=["QĐ-25"]),
    "UC53": dict(FR=[], RULE=[], BR=[], F=[], WF=[], UF=[], US=us(15, 2, 4), DEC=["QĐ-25", "QĐ-32a"]),
    "UC59": dict(FR=["FR-8.6", "FR-8.9", "FR-8.11"], RULE=["SoD-4"], BR=[], F=["F-37"], WF=["WF-03"], UF=["UF-17"], US=["US-01-10", "US-01-01"], DEC=["QĐ-46", "QĐ-47c"]),
    "UC60": dict(FR=["FR-8.8", "FR-8.10"], RULE=["SoD-1"], BR=["BR-37.1"], F=["F-37"], WF=["WF-03"], UF=["UF-13"], US=["US-01-09"], DEC=["QĐ-44", "QĐ-47a", "QĐ-47b", "QĐ-47e", "QĐ-47f"]),
}

# Codes intentionally without a use case, with the reason (checked against the sources).
NOT_MODELLED = {
    "FR-6.10": "Ngoài phạm vi hiện thực (F-33): thu thập web/firewall/proxy/CASB đầy đủ chỉ giữ đặc tả tương lai",
    "F-25": "G5 hạ gói — ngoài phạm vi",
    "F-33": "Discovery từ log web/proxy/CASB đầy đủ — ngoài phạm vi",
    "BR-13.1": "Nghỉ hưu ở User Flows v0.6 (QĐ-27, không còn ủy quyền)",
    "BR-13.3": "Nghỉ hưu ở User Flows v0.6 (QĐ-27)",
    "BR-13.5": "Nghỉ hưu ở User Flows v0.6 (QĐ-12 bị QĐ-27 thay thế)",
    "BR-13.7": "Nghỉ hưu ở User Flows v0.6 (QĐ-27)",
}

# Business rules added to User Flows on 25/09/2026 for this model (owner: User Flows).
# flow -> list of (code, rule, source)
NEW_BR = {
    "F-01": [
        ("BR-01.5", "Dòng nhân sự **thiếu Cost Center** bị từ chối ở bước xem trước, nêu đúng dòng và cột; hệ thống "
                    "**không** tạo nhân viên không có Cost Center và **không** dùng Cost Center kiểu *Chưa phân loại* để lách",
         "BRD `FR-9.7`, `INV-14b`, `QĐ-30c` — đồng bộ `BF-04`"),
        ("BR-01.6", "Mã Cost Center trong file nhân sự phải **đã có** trong danh mục Cost Center do **Finance** quản lý; "
                    "mã chưa có bị từ chối theo dòng ở bước xem trước, **không** tự tạo mã khi import",
         "OI-04 (Owner 25/09/2026)"),
        ("BR-01.7", "Giai đoạn khởi tạo — giai đoạn duy nhất được nhập Assignment **không có Request** — kết thúc khi IT Admin "
                    "**chốt hoàn tất bước 4** trên checklist (ghi Audit Trail). Sau đó mọi Assignment phải có Request; "
                    "không mở lại trong MVP; chênh lệch phát hiện sau đi qua đối soát sai lệch",
         "OI-10 (Owner 25/09/2026); BRD `FR-9.4`"),
    ],
    "F-05": [
        ("BR-05.6", "Hạn Manager xác nhận danh sách bàn giao mặc định là **1 ngày làm việc trước ngày làm việc cuối**; quá hạn "
                    "chỉ nhắc. Tới ngày làm việc cuối IT **vẫn thu hồi**, ghi cờ *chưa xác nhận bàn giao* — bảo mật ưu tiên "
                    "hơn bàn giao",
         "OI-14c (Owner 25/09/2026) — `OQ-US-08`"),
    ],
    "F-06": [
        ("BR-06.6", "Chuyển ứng dụng sang *ngừng sử dụng* là thao tác của IT Admin: kiểm tra quyền còn hiệu lực và ghi "
                    "**xác nhận của Business Owner** (người, thời điểm, nội dung) làm căn cứ. Business Owner không có thao tác "
                    "trên hệ thống",
         "OI-05b (Owner 25/09/2026) — `OQ-US-10`; BRD 4.4"),
        ("BR-06.7", "Business Owner nghỉ việc: giữ người cũ kèm cờ *cần thay thế* và cảnh báo IT tới khi có người mới đang làm "
                    "việc; `INV-06` ghi nhận là vi phạm tạm thời có cảnh báo. Cảnh báo gia hạn **không** gửi cho người đã nghỉ",
         "OI-05c (Owner 25/09/2026) — `OQ-US-12`; BRD `FR-1.7`"),
        ("BR-06.8", "Tệp gốc hợp đồng/hóa đơn chỉ mở qua đường dẫn có thời hạn: IT Admin trong quản lý hợp đồng, Finance trong "
                    "đối soát, **Người duyệt chi chỉ của hồ sơ đang được giao quyết**; Manager không mở (`SoD-2`)",
         "OI-08a (Owner 25/09/2026) — `OQ-US-11`; BRD `FR-1.5`"),
        ("BR-06.9", "Mỗi mục danh mục có một **nhóm chức năng** chọn từ danh sách do IT Admin duy trì; dùng để hiện công cụ "
                    "tương tự khi Manager xét nhu cầu và kiểm trùng chức năng khi đánh giá SaaS mới/Shadow IT. Không dùng cho "
                    "`G5` (ngoài phạm vi)",
         "OI-14e (Owner 25/09/2026) — `OQ-US-14`"),
    ],
    "F-07": [
        ("BR-07.11", "Người yêu cầu được **rút** yêu cầu tới khi tác vụ cấp phát còn *chờ thực thi*, kể cả khi đã duyệt đủ; "
                     "khoản cam kết (nếu có) được **giải phóng ngay** và Finance, IT được thông báo. Tác vụ đã *đang thực thi* "
                     "thì không rút, dùng hoàn trả sau khi có quyền",
         "OI-06 (Owner 25/09/2026) — `BF-12`; BRD 5.12.3, `FR-5.8`"),
    ],
    "F-13": [
        ("BR-13.11", "SLA của mọi loại bước tính theo **giờ làm việc** của tổ chức; mặc định **2 ngày làm việc**, Super Admin "
                     "chỉnh theo từng loại bước",
         "OI-14a (Owner 25/09/2026) — `OQ-US-02`; BRD `FR-3.8`"),
        ("BR-13.12", "Không lưu được cấu hình *Người duyệt chi thay thế khi xung đột* **trùng** Người duyệt chi (kể cả khi đổi "
                     "Người duyệt chi thành chính người thay thế)",
         "OI-17 (Owner 25/09/2026) — `OQ-US-01`; BRD `FR-3.15`"),
    ],
    "F-20": [
        ("BR-20.6", "`G1`, `G2` chỉ áp **cổng 1** (gói per-seat) và **cổng 8** (không trùng khuyến nghị mở); cổng 2–7 là cổng "
                    "bằng chứng sử dụng/người dùng, chỉ áp `G3`, `G4`",
         "OI-12a (Owner 25/09/2026) — `OQ-US-22`; BRD `FR-4.9`"),
        ("BR-20.7", "Cổng 5 chỉ dùng các ngày bao phủ **từ ngày bắt đầu Assignment**: đủ ngưỡng tầng tương ứng (`FR-4.12`) thì "
                    "được kết luận, thiếu thì không kết luận và ghi lý do cổng 5",
         "OI-12b (Owner 25/09/2026) — `OQ-US-23`"),
    ],
    "F-26": [
        ("BR-26.4", "Mốc T−15 gửi cảnh báo cho IT Admin, Finance, Business Owner **và Người duyệt chi**; mốc T−7 báo thêm "
                    "Super Admin",
         "OI-09a (Owner 25/09/2026) — `BF-08`; BRD 4.4, `FR-1.4`"),
    ],
    "F-27": [
        ("BR-27.5", "Quyết định **giảm** xuống dưới số Assignment đang hiệu lực: hệ thống liệt kê phần vượt (ưu tiên khuyến nghị "
                    "lãng phí đang mở), IT thu hồi **trước** ngày bắt đầu kỳ mới; kỳ mới chỉ được ghi khi số Assignment ≤ số "
                    "đã mua (`INV-01`)",
         "OI-11c (Owner 25/09/2026) — `OQ-US-25`"),
    ],
    "F-29": [
        ("BR-29.8", "Manager thấy **thực chi và cam kết đang giữ** quy về người trong cây cấp dưới (theo hiệu lực thời gian), "
                    "nhóm theo ứng dụng/nhà cung cấp; **không** thấy ngân sách, số còn lại, tổng công ty hay cây khác",
         "OI-08b (Owner 25/09/2026) — `OQ-US-26`; BRD 5.5.3, `SoD-2`"),
        ("BR-29.9", "Danh mục Cost Center (`Unit`/`Project`/`Company`) do **Finance** tạo, sửa và ngừng dùng; IT Admin không "
                    "tạo mã; không tạo Cost Center *Chưa phân loại*",
         "OI-04 (Owner 25/09/2026) — `OQ-US-05`; BRD `FR-3.1`, `FR-9.7`"),
    ],
    "F-31": [
        ("BR-31.6", "Bản ghi đã đóng *duyệt hợp thức hóa* không mở lại (ứng dụng đã vào danh mục). Bản ghi đã đóng *không duyệt* "
                    "mà bằng chứng xuất hiện lại thì **mở lại chính bản ghi đó** với cờ *tái xuất hiện sau khi không duyệt* "
                    "và nâng mức rủi ro",
         "OI-14f (Owner 25/09/2026) — `OQ-US-29`; BRD `FR-6.7`, `INV-13`"),
    ],
    "F-34": [
        ("BR-34.3", "Quyết định *không duyệt* và *báo nhầm* **bắt buộc có lý do**; *duyệt hợp thức hóa* không bắt buộc",
         "OI-14g (Owner 25/09/2026) — `OQ-US-30`"),
    ],
    "F-36": [
        ("BR-36.5", "Duyệt chi khi **chưa có ngân sách** vẫn tạo khoản cam kết, mang lý do *Chưa có ngân sách*; ngân sách của "
                    "đúng Cost Center và kỳ được lập sau thì **tự gắn ngược** các khoản đó",
         "BRD `FR-5.8a`, `INV-18`, `QĐ-30b` — đồng bộ `BF-04`"),
        ("BR-36.6", "Số còn lại được phép **âm** khi cam kết gắn ngược vượt hạn mức, kèm nhãn *đã cam kết vượt hạn mức*; không "
                    "làm tròn về 0, không tạo ngân sách 0 giữ chỗ",
         "BRD `FR-5.8a`, `QĐ-30b` — đồng bộ `BF-04`"),
        ("BR-36.7", "Hóa đơn khớp một phần: mỗi hóa đơn chuyển **đúng số tiền đó** thành chi phí, phần còn lại vẫn *Đang giữ*; "
                    "hết số còn lại thì *Đã thành chi phí*; Finance được giải phóng phần dư kèm lý do khi không còn hóa đơn; "
                    "không trừ hai lần",
         "OI-11a (Owner 25/09/2026) — `OQ-US-18`; BRD `FR-5.8`"),
        ("BR-36.8", "Kỳ ngân sách là **một loại kỳ cho toàn tổ chức** (tháng/quý/năm) do Super Admin đặt một lần, mặc định "
                    "**quý**; không đổi khi đã có ngân sách. Snapshot tính *tổng Request có chi phí đang chờ duyệt* trong "
                    "**cùng Cost Center và kỳ** của Request",
         "OI-11b, OI-11d (Owner 25/09/2026) — `OQ-US-19`, `OQ-US-17`"),
    ],
    "F-38": [
        ("BR-38.3", "Chỉ **Super Admin** tra cứu Audit Trail. Vai khác thấy lịch sử quyết định/trạng thái của đối tượng trong "
                    "phạm vi của mình ngay trong chức năng tương ứng",
         "OI-08c (Owner 25/09/2026) — `OQ-US-04`; BRD `FR-8.3`"),
    ],
    "F-40": [
        ("BR-40.4", "Yêu cầu **dừng thu thập** được xử lý trong **2 ngày làm việc** (mặc định, cấu hình được); quá hạn thì nhắc "
                    "và cảnh báo nghẽn như `FR-3.8`. Căn cứ pháp lý của con số còn chờ kiểm chứng văn bản gốc",
         "OI-01a (Owner 25/09/2026); BRD 5.11"),
        ("BR-40.5", "Yêu cầu dừng thu thập **hợp lệ** (thiết bị đã đăng ký của chính người gửi) **luôn được thực hiện**; IT chỉ "
                    "đóng yêu cầu **không hợp lệ** (không phải thiết bị của mình, trùng, đã dừng) kèm lý do; nhân viên gửi lại "
                    "được; không có luồng kháng nghị trong MVP",
         "OI-01b (Owner 25/09/2026)"),
        ("BR-40.6", "IT Admin được tự xử lý yêu cầu quyền dữ liệu của chính mình; Audit Trail gắn cờ *tự xử lý*",
         "OI-01c (Owner 25/09/2026)"),
        ("BR-40.7", "Nhân viên được **yêu cầu chỉnh sửa** dữ liệu cá nhân (ví dụ email, liên kết thiết bị sai); IT Admin xử lý. "
                    "Không sửa dữ liệu usage gốc hay Audit Trail; dữ liệu nhân sự sai được sửa theo nguồn nhân sự",
         "OI-13 (Owner 25/09/2026) — `OQ-US-31`; BRD 5.11"),
        ("BR-40.8", "Yêu cầu chỉnh sửa và **ngoại lệ xuất dữ liệu** được xử lý trong **10 ngày** (mặc định, cấu hình được); "
                    "quá hạn thì nhắc và cảnh báo nghẽn. Căn cứ pháp lý còn chờ kiểm chứng",
         "OI-13b (Owner 25/09/2026); BRD 5.11"),
    ],
    "F-42": [
        ("BR-42.7", "Kênh thông báo MVP: **trong ứng dụng** cho mọi thông báo; **thư điện tử** (khi kênh email được cấu hình) "
                    "chỉ thêm cho **cảnh báo trước hạn báo hủy** (`F-26`) và **thông báo trước khi theo dõi** (`F-42`). "
                    "Lỗi gửi thư không được coi là đã thông báo",
         "OI-EMAIL, OI-09b (Owner 25/09/2026) — `OQ-US-07`, `TE-05`"),
    ],
    "F-45": [
        ("BR-45.8", "Một nhân viên có thể có **nhiều** thiết bị đăng ký, mỗi thiết bị xác nhận riêng; thiết bị **dùng chung** "
                    "nhiều người **không** đăng ký thu thập trong MVP (ghi là điểm mù)",
         "OI-14d (Owner 25/09/2026) — `OQ-US-21`"),
    ],
}

# Existing BR whose wording is clarified (code and meaning kept; only the missing actor/value is filled in).
BR_CLARIFIED = {
    "BR-07.4": "xác nhận thêm là **xác nhận tường minh của Manager** trong bước xét nhu cầu, kèm lý do (OI-07a)",
    "BR-15.1": "như `BR-07.4` (OI-07a)",
    "BR-39.4": "như `BR-07.4` (OI-07a)",
    "BR-09.3": "ý kiến là **đầu vào không chặn**: IT ghi ý kiến Business Owner ứng dụng tương đương (nếu có) hoặc Manager "
               "của người yêu cầu; không thêm bước/SLA/người duyệt (OI-05a)",
    "BR-45.5": "mặc định N = **5 phút/ngày** (OI-14b)",
}
