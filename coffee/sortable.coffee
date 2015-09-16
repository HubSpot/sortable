SELECTOR = 'table[data-sortable]'

numberRegExp = /^-?[£$¤]?[\d,.]+%?$/
trimRegExp = /^\s+|\s+$/g

clickEvents = ['click']
touchDevice = 'ontouchstart' of document.documentElement
clickEvents.push 'touchstart' if touchDevice

addEventListener = (el, event, handler) ->
  if el.addEventListener?
    el.addEventListener event, handler, false
  else
    el.attachEvent "on#{ event }", handler

sortable =
  init: (options={}) ->
    options.selector ?= SELECTOR

    tables = document.querySelectorAll options.selector
    sortable.initTable table for table in tables

  initTable: (table) ->
    return if table.tHead?.rows.length isnt 1
    return if table.getAttribute('data-sortable-initialized') is 'true'

    table.setAttribute 'data-sortable-initialized', 'true'

    ths = table.querySelectorAll('th')

    for th, i in ths
      if th.getAttribute('data-sortable') isnt 'false'
        sortable.setupClickableTH table, th, i

    table

  setupClickableTH: (table, th, i) ->
    type = sortable.getColumnType table, i

    onClick = (e) ->
      if e.handled isnt true
        e.handled = true
      else
        return false

      sorted = @getAttribute('data-sorted') is 'true'
      sortedDirection = @getAttribute 'data-sorted-direction'

      if sorted
        newSortedDirection = if sortedDirection is 'ascending' then 'descending' else 'ascending'
      else
        newSortedDirection = type.defaultSortDirection

      ths = @parentNode.querySelectorAll('th')
      for th in ths
        th.setAttribute 'data-sorted', 'false'
        th.removeAttribute 'data-sorted-direction'

      @setAttribute 'data-sorted', 'true'
      @setAttribute 'data-sorted-direction', newSortedDirection

      tBody = table.tBodies[0]
      rowArray = []

      if not sorted
        if type.compare?
          _compare = type.compare
        else
          _compare = (a, b) ->
            b - a

        compare = (a, b) ->
          if a[0] is b[0]
            return a[2] - b[2]

          if type.reverse
            _compare b[0], a[0]
          else
            _compare a[0], b[0]

        for row, position in tBody.rows
          value = sortable.getNodeValue(row.cells[i])
          if type.comparator?
            value = type.comparator(value)

          rowArray.push [value, row, position]

        rowArray.sort compare
        tBody.appendChild row[1] for row in rowArray
      else
        rowArray.push item for item in tBody.rows
        rowArray.reverse()
        tBody.appendChild row for row in rowArray

      if typeof window['CustomEvent'] is 'function'
        table.dispatchEvent?(new CustomEvent 'Sortable.sorted', { bubbles: true })

    for eventName in clickEvents
      addEventListener th, eventName, onClick

  getColumnType: (table, i) ->
    specified = table.querySelectorAll('th')[i]?.getAttribute('data-sortable-type')
    return sortable.typesObject[specified] if specified?

    for row in table.tBodies[0].rows
      text = sortable.getNodeValue row.cells[i]

      for type in sortable.types
        if type.match text
          return type

    return sortable.typesObject.alpha

  getNodeValue: (node) ->
    return '' unless node
    dataValue = node.getAttribute 'data-value'
    return dataValue if dataValue isnt null
    return node.innerText.replace(trimRegExp, '') unless typeof node.innerText is 'undefined'
    node.textContent.replace trimRegExp, ''

  setupTypes: (types) ->
    sortable.types = types
    sortable.typesObject = {}
    sortable.typesObject[type.name] = type for type in types

sortable.setupTypes [{
  name: 'numeric'
  defaultSortDirection: 'descending'
  match: (a) -> a.match numberRegExp
  comparator: (a) -> parseFloat(a.replace(/[^0-9.-]/g, ''), 10) or 0
}, {
  name: 'date'
  defaultSortDirection: 'ascending'
  reverse: true
  match: (a) -> not isNaN Date.parse a
  comparator: (a) -> Date.parse(a) or 0
}, {
  name: 'alpha'
  defaultSortDirection: 'ascending'
  match: -> true
  compare: (a, b) -> a.localeCompare b
}]

setTimeout sortable.init, 0

if typeof define is 'function' and define.amd
  define -> sortable
else if typeof exports isnt 'undefined'
  module.exports = sortable
else
  window.Sortable = sortable
