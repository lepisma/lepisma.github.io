import pandas as pd

# Read lastfm data
lastfm = pd.read_csv("lastfm.csv", header=None)
lastfm["uid"] = lastfm[0] + lastfm[1] + lastfm[2]

# Normal times
times_lfm = pd.DataFrame({
    "scrobble-time": pd.to_datetime(lastfm[3])
})
times_lfm.to_csv("times-lfm.csv", index=False)

# Just the first scrobbles
times_lfm_dd = pd.DataFrame({
    "scrobble-time": pd.to_datetime(
        lastfm.drop_duplicates("uid", keep="last")[3]
    )
})
times_lfm_dd.to_csv("times-lfm-dd.csv", index=False)

# Read tweets
times_tw = pd.read_csv("times-tw.csv")
times_tw["tweet-time"] = pd.to_datetime(times_tw["tweet-time"])

# Per day counts
ins = [(times_lfm, times_lfm["scrobble-time"]),
       (times_lfm_dd, times_lfm_dd["scrobble-time"]),
       (times_tw, times_tw["tweet-time"])]

outs = ["counts-lfm.csv", "counts-lfm-dd.csv", "counts-tw.csv"]

for idx, it in enumerate(ins):
    counts = it[0].groupby(it[1].dt.normalize()).count()
    counts.columns = ["count"]
    counts = counts.reset_index()
    counts.columns = ["date", "count"]
    counts.to_csv(outs[idx], index=False)

# Diffs
ins = [times_lfm["scrobble-time"], times_lfm_dd["scrobble-time"], times_tw["tweet-time"]]
outs = ["diffs-lfm.csv", "diffs-lfm-dd.csv", "diffs-tw.csv"]

for idx, ts in enumerate(ins):
    diffs = []
    for i in range(len(ts) - 1):
        diffs.append(int((ts.iloc[i] - ts.iloc[i + 1]).total_seconds() // 60))

    pd.DataFrame({
        "pre": diffs[1:],
        "post": diffs[:-1]
    }).to_csv(outs[idx], index=False)
