// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Searchmetrics API')
     // .addItem('My menu item', 'myFunction')
     // .addSeparator()
      .addSubMenu(SpreadsheetApp.getUi().createMenu('Configure')
          .addItem('New Project', 'showSidebar')
          .addSeparator()
          .addItem('Schedule', 'myThirdFunction'))
      .addToUi();
}





function showSidebar(){

 var html = HtmlService.createTemplateFromFile('ui');
   SpreadsheetApp.getUi()
     .showSidebar(html.evaluate().setTitle('Searchmetrics API'));
}

function include(filename) {
 return HtmlService.createHtmlOutputFromFile(filename)
     .getContent();
}


/*
function showSidebar() {
 var ui = HtmlService.createHtmlOutputFromFile('ui')
     .setTitle('Searchmetrics API');
 SpreadsheetApp.getUi().showSidebar(ui);
}*/
