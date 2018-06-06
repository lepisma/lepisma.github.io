/* global d3, tufte */
/* eslint-disable no-new */

// Get histogram from diffs
function getHistogramData (diffData, bins) {
  // Taking just one side of diff
  let x = diffData.map(d => Math.log(d.x))
  let nBins = bins || d3.thresholdFreedmanDiaconis(x, d3.min(x), d3.max(x))
  let ys = d3.histogram().thresholds(nBins)(x).map(bin => bin.length)
  let ext = d3.extent(x)
  return ys.map((d, idx) => {
    return {
      x: (idx / ys.length) * (ext[1] - ext[0]) + ext[0],
      y: d
    }
  })
}

// Remove effect of mass scrobble due to player bug
function filterScrobbleDiffs (diffData) {
  return diffData.filter(d => !(d.x < 3 || d.y < 3))
    .filter(d => !(d.x > 200000 || d.y > 200000))
}

// Remove effect of mass scrobble and lastfm bug
function filterScrobbleCounts (countData) {
  return countData.filter(d => d.x > new Date('1970-01-01'))
    .filter(d => d.y < 1000)
}

function parseCounts (data) {
  let parseTime = d3.utcParse('%Y-%m-%d')
  return data.map((d, i) => {
    return {
      x: parseTime(d.date),
      y: parseInt(d.count)
    }
  })
}

function parseDiffs (data) {
  return data.filter(d => !(d.pre === '0' || d.post === '0')).map(d => {
    return {
      x: parseInt(d.pre),
      y: parseInt(d.post)
    }
  })
}

d3.csv('./counts-lfm.csv', function (error, data) {
  let dt = filterScrobbleCounts(parseCounts(data))
  new tufte.LinePlot(
    '#counts-lfm',
    dt,
    {
      label: {x: 'Date', y: 'Listens per day'},
      scaleType: {x: 'time'}
    }
  )
})

d3.csv('./diffs-lfm.csv', function (error, data) {
  let dt = filterScrobbleDiffs(parseDiffs(data))

  new tufte.ScatterPlot(
    '#diffs-lfm-vanilla',
    dt,
    {
      height: 600,
      scaleType: {x: 'log', y: 'log'},
      label: {x: 'before (min)', y: 'after (min)'}
    }
  )

  new tufte.ScatterPlot(
    '#diffs-lfm',
    dt,
    {
      height: 600,
      scaleType: {x: 'log', y: 'log'},
      marginal: true,
      label: {x: 'before (min)', y: 'after (min)'}
    }
  )
})

d3.csv('./diffs-lfm-dd.csv', function (error, data) {
  let dt = filterScrobbleDiffs(parseDiffs(data))
  new tufte.ScatterPlot(
    '#diffs-lfm-dd',
    dt,
    {
      height: 600,
      scaleType: {x: 'log', y: 'log'},
      marginal: true,
      label: {x: 'before (min)', y: 'after (min)'}
    }
  )

  new tufte.LinePlot(
    '#dd-hist',
    getHistogramData(dt),
    {
      label: {x: 'diffs (log min)', y: 'counts'},
      dotLinePlot: false
    }
  )
})

// Tweet plots
d3.csv('./counts-tw.csv', function (error, data) {
  let dt = parseCounts(data)
  new tufte.LinePlot(
    '#counts-tw',
    dt,
    {
      label: {x: 'Date', y: 'Tweets'},
      scaleType: {x: 'time'}
    }
  )
})

d3.csv('./diffs-tw.csv', function (error, data) {
  let dt = parseDiffs(data)
  new tufte.ScatterPlot(
    '#diffs-tw',
    dt,
    {
      height: 600,
      scaleType: {x: 'log', y: 'log'},
      marginal: true,
      label: {x: 'before (min)', y: 'after (min)'}
    }
  )

  new tufte.LinePlot(
    '#tw-hist',
    getHistogramData(dt),
    {
      label: {x: 'diffs (log min)', y: 'counts'},
      dotLinePlot: false
    }
  )

  new tufte.LinePlot(
    '#tw-hist-less',
    getHistogramData(dt, 10),
    {
      label: {x: 'diffs (log min)', y: 'counts'},
      dotLinePlot: false
    }
  )

  new tufte.LinePlot(
    '#tw-hist-more',
    getHistogramData(dt, 200),
    {
      label: {x: 'diffs (log min)', y: 'counts'},
      dotLinePlot: false
    }
  )
})
