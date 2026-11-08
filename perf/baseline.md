# baseline

JS gzip (all chunks): 118630 bytes

|Route|Width|CPU|p50|p95|p99|>20ms %|Long tasks|LCP ms|CLS|Pre-gate KB|Budget|
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
|home|1440|1|50.0|83.5|133.3|93.0|93|524|0.004|581|FAIL|
|projects|1440|1|83.3|116.6|133.3|96.9|110|588|0.006|581|FAIL|
|roomly|1440|1|33.4|50.1|50.3|83.6|5|764|0.002|1153|FAIL|
|swiftship|1440|1|33.4|50.2|66.6|86.0|5|708|0.003|862|FAIL|
|signalroute|1440|1|33.5|66.6|66.8|92.6|41|544|0.006|944|FAIL|
|about|1440|1|16.7|33.5|50.1|37.4|5|552|0.003|581|FAIL|
|contact|1440|1|83.2|116.6|133.5|97.7|113|548|0.003|581|FAIL|
|home|390|1|50.2|83.8|133.4|92.6|87|524|0.000|581|FAIL|
|projects|390|1|66.6|83.4|166.7|95.2|87|436|0.000|581|FAIL|
|roomly|390|1|16.8|33.5|50.1|43.7|3|544|0.000|1152|FAIL|
|swiftship|390|1|16.7|33.5|50.0|34.1|3|532|0.000|862|FAIL|
|signalroute|390|1|16.9|33.5|50.1|48.8|2|644|0.000|940|FAIL|
|about|390|1|16.7|16.9|33.4|1.5|0|372|0.000|581|FAIL|
|contact|390|1|50.1|99.9|116.7|95.8|85|540|0.000|581|FAIL|
|home|1440|4|1999.9|2033.3|2033.3|100.0|7|2292|0.004|581|FAIL|
|projects|1440|4|150.1|533.3|1166.7|98.0|46|1788|0.006|581|FAIL|
|roomly|1440|4|316.7|616.6|683.4|100.0|31|2372|0.000|1153|FAIL|
|swiftship|1440|4|416.7|666.7|700.2|100.0|24|3556|0.003|862|FAIL|
|signalroute|1440|4|483.4|600.1|683.4|100.0|21|2796|0.000|944|FAIL|
|about|1440|4|183.4|499.9|583.4|100.0|40|2908|0.003|581|FAIL|
|contact|1440|4|450.0|1299.8|1299.8|100.0|16|3300|0.003|581|FAIL|
|home|390|4|233.0|350.0|416.7|100.0|47|2408|0.000|581|FAIL|
|projects|390|4|500.1|733.3|900.0|95.5|21|2828|0.000|581|FAIL|
|roomly|390|4|233.2|349.9|416.6|100.0|44|2564|0.000|1152|FAIL|
|swiftship|390|4|216.6|333.2|433.2|95.7|44|3344|0.000|862|FAIL|
|signalroute|390|4|266.4|333.4|383.4|97.6|40|2564|0.000|940|FAIL|
|about|390|4|149.8|233.5|266.6|97.2|67|1984|0.000|581|FAIL|
|contact|390|4|716.7|883.2|883.2|100.0|14|1984|0.000|581|FAIL|

Production Vite preview; cold context per route; high quality forced.

TBT proxy is sum(max(longtask-50,0)) after gate, not Lighthouse navigation TBT.

LCP describes the gate/first navigation, not post-click scene readiness.

CPU throttling is not a physical mid-range phone or GPU throttle.

Trace event totals are inclusive and overlap; not additive. Paint count unavailable in Performance.getMetrics.