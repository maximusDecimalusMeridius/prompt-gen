  /** 
 * @OnlyCurrentDoc
 * @NotOnlyCurrentDoc
 * 
 * Column and row index is real column position number
 * Resave as .gs or paste to .gs file
 * 
 */

//Globals
var mainSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var promptSheet = mainSpreadsheet.getActiveSheet();
var deconSheet = mainSpreadsheet.getSheetByName("Prompt Deconstructor");
var oldPromptsSheet = mainSpreadsheet.getSheetByName("Old Prompts");
var promptSheetRange = promptSheet.getRange(1, 1, promptSheet.getLastRow(), promptSheet.getLastColumn());

//Prompt vars
var promptArray = [];
var outputAdjustArray = [];

//Deconstructor vars
var deconstructedArray = [];

//open UI Dialog
function openDialog(prompt) {
  var html = HtmlService.createHtmlOutputFromFile("Page");
  html.append("<div style=\"height: fit-content; min-height: 100px; width: 90%; border: 1px solid black; padding: 2px 4px; margin: 0 auto;\">" 
  + prompt 
  + "</div></body></html>");
  //console.log(html.getContent());
  SpreadsheetApp.getUi().showModalDialog(html, "Noice!");
}

//Function to archive old prompts - passed the prompt and whether it is being constructed or deconstructed
//adds a row, merges cells, adds a black border, and enables word wrap
function archivePrompt(prompt, action){
  var constructed = oldPromptsSheet.getRange("A3:F3");
  var deconstructed = oldPromptsSheet.getRange("G3:L3");
  
  if(action == "construct"){
    constructed.insertCells(SpreadsheetApp.Dimension.ROWS).merge().setBorder(true, true, true, true, false, false, "black", null).setWrap(true);
    constructed.setValue(prompt);
  }
  else{
    deconstructed.insertCells(SpreadsheetApp.Dimension.ROWS).merge().setBorder(true, true, true, true, false, false, "black", null).setWrap(true);
    deconstructed.setValue(prompt);
  }
}

//Function to read checkboxes and build the prompt array with descriptors and image editors
function getCheckboxes(){
  promptArray = [];
  outputAdjustArray = [];
  
  for(var j = 1; j < promptSheetRange.getLastRow() + 1; j++){
    for(var k = 1; k < promptSheetRange.getLastColumn() + 1; k++){
      if(promptSheet.getRange(j, k).isChecked()){
        if(promptSheet.getRange(j, k).offset(0,1).getValue().charAt(0) == "-"){
          outputAdjustArray = outputAdjustArray + promptSheet.getRange(j, k).offset(0, 1).getValue() + ", ";
        }
          else{
            promptArray = promptArray + promptSheet.getRange(j, k).offset(0, 1).getValue() + ", ";
          }
      }
    }
  }
}

//Read the name of the function...super slow too
function resetCheckboxes(){
  for(var j = 1; j < promptSheetRange.getLastRow() + 1; j++){
    for(var k = 1; k < promptSheetRange.getLastColumn() + 1; k++){
      if(promptSheet.getRange(j, k).isChecked()){
        promptSheet.getRange(j, k).setValue(false);
      }
    }
  }
}

//Builds the prompt by calling getCheckboxes and setting the values of the prompt box
function createPrompt(){
  getCheckboxes();

  if(outputAdjustArray == false){
    finalArray = promptArray.trim();
  } else {
      finalArray = (promptArray + outputAdjustArray.trim());
  }

  finalArray = finalArray.slice(0, finalArray.length-1).toLowerCase();

  openDialog(finalArray);
  archivePrompt(finalArray, "construct");
}

//function to deconstruct a prompt when entered by the user on the second tab
function deconstructPrompt(){
  
  var delimiter = deconSheet.getNamedRanges()[0].getRange().getValue();
  var deconWindow = deconSheet.getNamedRanges()[1].getRange();

  console.log(delimiter);

  switch(delimiter){
    case "comma":
      deconstructedArray = deconWindow.getValue().split(",");
      break;
    case "plus sign":
      deconstructedArray = deconWindow.getValue().split("+");
      break;
    case ":":
      deconstructedArray = deconWindow.getValue().split(":");
      break;
    case "::":
      deconstructedArray = deconWindow.getValue().split("::");
      break;
    default:
      deconstructedArray = deconWindow.getValue().split(",");
      break;
  }

  console.log(deconstructedArray);

  if(!deconSheet.getRange(8, 2).getValue()){
    for(var j = 0; j < deconstructedArray.length; j++){
      deconSheet.getRange((8 + j), 2).setValue(deconstructedArray[j].trim()).setBorder(true, true, true, true, false, false, "black", null).setBackground("white");
      deconSheet.getRange((8 + j), 1).insertCheckboxes().setBorder(true, true, true, true, false, false, "black", null).setBackground("white");
    }
  } else {
    for(var j = 0; j < deconstructedArray.length; j++){
      deconSheet.getRange((deconSheet.getLastRow() + 1), 1).insertCheckboxes().setBorder(true, true, true, true, false, false, "black", null).setBackground("white");
      deconSheet.getRange(deconSheet.getLastRow(), 2).setValue(deconstructedArray[j].trim()).setBorder(true, true, true, true, false, false, "black", null).setBackground("white");
    }
  }

  archivePrompt(deconWindow.getValue(), "deconstruct");
}

//If someone adds a super long note in the artist description field set a super long note
function onEdit(e) {
  
  var range = e.range;
  var editedColumn = range.getColumn();
  var note = range.getValue();
  //var dv = range.getDataValidation();                                                    //data validation rule

  //Set a note for artist description cells
  if(note == ""){
    range.setNote("");
  } else if (editedColumn == 12){
    range.setNote(note);
  }

  if(range.getValue() == "Select One"){
    range.offset(0, -1).setValue(false);
  }

}
