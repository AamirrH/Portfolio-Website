# step8-high

JS gzip (all chunks): 123839 bytes

|Route|Width|CPU|p50|p95|p99|>20ms %|Long tasks|LCP ms|CLS|Pre-gate KB|Budget|
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
|home|1440|1|16.7|16.9|17.4|0.5|0|1300|0.002|358|FAIL|
|roomly|1440|1|16.7|16.8|17.0|0.3|0|764|0.002|807|FAIL|

Production Vite preview; cold context per route; high quality forced.

TBT proxy is sum(max(longtask-50,0)) after gate, not Lighthouse navigation TBT.

LCP describes the gate/first navigation, not post-click scene readiness.

CPU throttling is not a physical mid-range phone or GPU throttle.

Trace event totals are inclusive and overlap; not additive. Paint count unavailable in Performance.getMetrics.