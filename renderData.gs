
function renderData(data)
  {

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var cell = sheet.getActiveCell();

    //Logger.log("Col: "+cell.getColumn());
    //Logger.log("Row: "+cell.getRow());
    // cell.setValue("sssssssss")
    //return;
    //var cell = sheet.getRange('B2:C2');
    // var data = sheet.getDataRange().getValues();

    Logger.log("Data to render:", data.response);
    Logger.log("Datatype:", typeof data.response);

    if (!data)
    {
       Logger.log("No valid data",data);
       return;
    }
    if(typeof data.response == "string")
    {
     handleStringData(ss,sheet,cell,data);
    }
    if (typeof data.response == "object")
    {
     handleObjectData(ss,sheet,cell,data)
    }
    if (typeof data.response == "array")
    {
      Logger.log("Array detected");
    }
  }


function renderHeaderRow(sheet,spreadsheetData,cell)
  {
         var dataHolder = spreadsheetData[0];
         for (var p in dataHolder)
        {
           var val = dataHolder[p];
           cell.setValue(p);
           cell.getColumn();
           cell = sheet.getRange(cell.getRow(),cell.getColumn()+1);    // move one cell to right;
        }
         return cell;
  }


function handleStringData(ss,sheet,cell,data)
  {
      data = data.response;
      Logger.log("Simple-Data: ",data);
      cell.setValue(data);
      sheet.getRange(cell.getRow(),cell.getColumn());
  }


function handleObjectData(ss,sheet,cell,data)
  {

    var initialCell = cell;
    var spreadsheetData = data.response;

    //Logger.log("HandleObjectData has Data",data.response);

    cell = renderHeaderRow(sheet,spreadsheetData,cell);
    Logger.log(cell);

    cell = sheet.getRange(cell.getRow() +1,initialCell.getColumn());  // move on row down



      //Logger.log("Array:isArray check:", Array.isArray(spreadsheetData));
      // Logger.log(typeof(spreadsheetData));


      /*  for (var p in spreadsheetData)
        {


           var val = spreadsheetData[p];
           Logger.log(val);
           cell.setValue(val);
           cell.getColumn();
           cell = sheet.getRange(cell.getRow(),cell.getColumn()+1);

        }
          cell = sheet.getRange(cell.getRow() +1,initialCell.getColumn());*/

     if (Array.isArray(spreadsheetData)) // data is an Array
     {

        for (var i in spreadsheetData)
        {
            var dataHolder = spreadsheetData[i];


            for (var p in dataHolder)
            {
               var val = dataHolder[p];
               cell.setValue(val);
               cell.getColumn();
               Logger.log("val",val);
               cell = sheet.getRange(cell.getRow(),cell.getColumn()+1);    // move one cell to right;

            }

            cell = sheet.getRange(cell.getRow() +1,initialCell.getColumn());  // move on row down
        }

     }
     else
     {
         for (var i in spreadsheetData)
        {
            var dataHolder = spreadsheetData[i];

            for (var p in dataHolder)
            {
               var val = dataHolder[p];
               Logger.log("key",p,"val",val);
               cell.setValue(p);
               cell = sheet.getRange(cell.getRow(),cell.getColumn()+1);    // move one cell to right;
               cell.setValue(val);
               cell = sheet.getRange(cell.getRow(),cell.getColumn()+1);    // move one cell to right;
               cell = sheet.getRange(cell.getRow() +1,initialCell.getColumn());  // move on row down
            }

        }
     }


  }
