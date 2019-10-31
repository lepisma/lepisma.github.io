/* global d3 vegaEmbed */

const dataFile = './linguist-data.json'

document.addEventListener('DOMContentLoaded', function (event) {
  d3.json(dataFile).then(function (data) {
    document.getElementById('n-languages').textContent = data.length

    let spec = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v4.json',
      'repeat': {
        'row': ['h', 's', 'l'],
        'column': ['h', 's', 'l']
      },
      'spec': {
        'data': {
          'values': data,
          'format': {'type': 'json'}
        },
        'mark': {'type': 'point'},
        'transform': [{
          'calculate': "'https://github.com/trending?l=' + datum.name", 'as': 'url'
        }],
        'selection': {
          'brush': {
            'type': 'interval',
            'resolve': 'union',
            'on': '[mousedown[event.shiftKey], window:mouseup] > window:mousemove!',
            'translate': '[mousedown[event.shiftKey], window:mouseup] > window:mousemove!',
            'zoom': 'wheel![event.shiftKey]'
          },
          'grid': {
            'type': 'interval',
            'resolve': 'global',
            'bind': 'scales',
            'translate': '[mousedown[!event.shiftKey], window:mouseup] > window:mousemove!',
            'zoom': 'wheel![!event.shiftKey]'
          }
        },
        'encoding': {
          'x': {'field': {'repeat': 'column'}, 'type': 'quantitative'},
          'y': {
            'field': {'repeat': 'row'},
            'type': 'quantitative',
            'axis': {'minExtent': 30}
          },
          'tooltip': {'field': 'name', 'type': 'nominal'},
          'href': {'field': 'url', 'type': 'nominal'},
          'color': {
            'condition': {
              'selection': 'brush',
              'field': 'color',
              'type': 'nominal',
              'scale': null
            },
            'value': 'gray'
          }
        }
      }
    }

    vegaEmbed('#viz', spec)
  })
})
