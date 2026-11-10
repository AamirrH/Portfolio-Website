# after

JS gzip (all chunks): 127586 bytes

|Route|Width|CPU|p50|p95|p99|>20ms %|Long tasks|LCP ms|CLS|Pre-gate KB|Budget|
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
|home|1440|4|49.8|83.4|100.1|79.3|73|720|0.000|131|FAIL|
|projects|1440|4|33.4|83.3|83.5|71.4|61|932|0.000|131|FAIL|
|roomly|1440|4|33.3|66.6|83.5|57.9|34|264|0.000|102|FAIL|
|swiftship|1440|4|16.8|50.0|66.6|37.4|11|940|0.000|102|FAIL|
|signalroute|1440|4|33.4|66.8|83.6|72.0|54|924|0.000|102|FAIL|
|about|1440|4|33.2|66.6|83.2|53.6|30|352|0.000|102|FAIL|
|contact|1440|4|33.4|83.4|100.1|72.1|64|884|0.000|131|FAIL|
|home|1440|1|16.7|16.8|16.9|0.0|0|196|0.000|131|PASS|
|projects|1440|1|16.7|16.8|16.9|0.0|0|212|0.000|131|PASS|
|roomly|1440|1|16.7|16.8|16.9|0.0|0|204|0.000|102|PASS|
|swiftship|1440|1|16.7|16.8|16.9|0.0|0|212|0.000|102|PASS|
|signalroute|1440|1|16.7|16.8|16.9|0.0|0|200|0.000|102|PASS|
|about|1440|1|16.7|16.8|16.9|0.0|0|232|0.000|102|PASS|
|contact|1440|1|16.7|16.9|16.9|0.2|0|204|0.000|131|PASS|
|home|390|1|16.7|16.8|17.0|0.0|0|192|0.000|131|PASS|
|projects|390|1|16.7|16.8|16.9|0.0|0|196|0.000|131|PASS|
|roomly|390|1|16.7|16.9|16.9|0.0|0|212|0.000|102|PASS|
|swiftship|390|1|16.7|16.9|16.9|0.0|0|220|0.000|102|PASS|
|signalroute|390|1|16.7|16.9|16.9|0.0|0|196|0.000|102|PASS|
|about|390|1|16.7|16.8|16.9|0.0|0|188|0.000|102|PASS|
|contact|390|1|16.7|16.8|16.9|0.0|0|212|0.000|131|PASS|
|home|390|4|33.2|50.1|66.6|52.8|12|420|0.000|131|FAIL|
|projects|390|4|16.9|50.0|66.6|49.3|21|280|0.000|131|FAIL|
|roomly|390|4|16.8|33.5|50.0|40.5|1|300|0.000|102|FAIL|
|swiftship|390|4|16.7|33.4|33.6|17.8|1|296|0.000|102|FAIL|
|signalroute|390|4|16.8|50.0|50.1|44.1|3|288|0.000|102|FAIL|
|about|390|4|16.7|33.4|33.5|19.1|0|216|0.000|102|FAIL|
|contact|390|4|33.3|50.1|66.7|59.6|21|320|0.000|131|FAIL|

Production Vite preview; cold context per route; high quality forced.

TBT proxy is sum(max(longtask-50,0)) after gate, not Lighthouse navigation TBT.

LCP describes the gate/first navigation, not post-click scene readiness.

CPU throttling is not a physical mid-range phone or GPU throttle.

Trace event totals are inclusive and overlap; not additive. Paint count unavailable in Performance.getMetrics.