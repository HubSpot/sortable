(function(){
  Array.prototype.forEach.call(document.querySelectorAll('table'), function(table){
    tables.setAttribute('data-sortable');
    tables.add('sortable-theme-' + INSTALL_OPTIONS.theme);
  });
})();
