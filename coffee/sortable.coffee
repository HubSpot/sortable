SELECTOR = 'table[data-sortable]'

numberRegExp = /^-?[£$¤]?[\d,.]+%?$/
trimRegExp = /^\s+|\s+$/g

touchDevice = 'ontouchstart' of document.documentElement
clickEvent = if touchDevice then 'touchstart' else 'click'

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

    addEventListener th, clickEvent, (e) ->
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

      for row in tBody.rows
        rowArray.push [sortable.getNodeValue(row.cells[i]), row]

      if sorted
        rowArray.reverse()
      else
        rowArray.sort type.compare

      for rowArrayObject in rowArray
        tBody.appendChild rowArrayObject[1]

  getColumnType: (table, i) ->
    for row in table.tBodies[0].rows
      text = sortable.getNodeValue row.cells[i]
      return sortable.types.numeric if text isnt '' and text.match(numberRegExp)
    return sortable.types.alpha

  getNodeValue: (node) ->
    return '' unless node
    return node.getAttribute('data-value') if node.getAttribute('data-value') isnt null
    return node.innerText.replace(trimRegExp, '') unless typeof node.innerText is 'undefined'
    node.textContent.replace trimRegExp, ''

  types:
    numeric:
      defaultSortDirection: 'descending'
      compare: (a, b) ->
        aa = parseFloat(a[0].replace(/[^0-9.-]/g, ''))
        bb = parseFloat(b[0].replace(/[^0-9.-]/g, ''))
        aa = 0 if isNaN(aa)
        bb = 0 if isNaN(bb)
        bb - aa

    alpha:
      defaultSortDirection: 'ascending'
      compare: (a, b) ->
        aa = a[0].toLowerCase()
        bb = b[0].toLowerCase()
        return 0 if aa is bb
        return -1 if aa < bb
        1

setTimeout sortable.init, 0

window.Sortable = sortable
