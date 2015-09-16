(function(){
  var options = INSTALL_OPTIONS;

  Array.prototype.forEach.call(document.querySelectorAll('table'), function(table){
    table.setAttribute('data-sortable', '');
    table.add('sortable-theme-' + options.theme);
  });
})();
