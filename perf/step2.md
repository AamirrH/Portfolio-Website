# step2

JS gzip (all chunks): 119156 bytes

|Route|Width|CPU|p50|p95|p99|>20ms %|Long tasks|LCP ms|CLS|Pre-gate KB|Budget|
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
|home|1440|1|16.7|33.4|33.6|8.7|0|1712|0.004|582|FAIL|
|roomly|1440|1|16.7|16.9|17.4|0.3|0|1332|0.002|1153|FAIL|

Production Vite preview; cold context per route; high quality forced.

TBT proxy is sum(max(longtask-50,0)) after gate, not Lighthouse navigation TBT.

LCP describes the gate/first navigation, not post-click scene readiness.

CPU throttling is not a physical mid-range phone or GPU throttle.

Trace event totals are inclusive and overlap; not additive. Paint count unavailable in Performance.getMetrics.