var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var schoolDBName = "SCHOOL-DB";
var schoolRelationName = "STUDENT-TABLE";
var connToken = "90932791|-31949278872274601|90948551";

$("#roll").focus();

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getStudentAsJsonObj() {
  var roll = $("#roll").val();
  var jsonStr = {
    id: roll
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsondObj) {
  saveRecNo2LS(jsondObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#name").val(record.name);
  $("#class").val(record.class);
  $("#birth").val(record.birth);
  $("#address").val(record.address);
  $("#enrollment").val(record.enrollment);
}

function resetForm() {
  $("#roll").val("");
  $("#name").val("");
  $("#class").val("");
  $("#birth").val("");
  $("#address").val("");
  $("#enrollment").val("");
  $("#roll").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#roll").focus();
}

function validateData() {
  var roll, name, class, birth, address, enrollment;
  roll = $("#roll").val();
  name = $("#name").val();
  class = $("#class").val();
  birth = $("#birth").val();
  address = $("#address").val();
  enrollment = $("#enrollment").val();

  if (roll === " ") {
    alert("Roll number unavailable");
    $("#roll").focus();
    return " ";
  }

  if (name === " ") {
    alert("Full name unavailable");
    $("#name").focus();
    return " ";
  }

  if (class === " ") {
    alert("Class unavailable");
    $("#class").focus();
    return " ";
  }

  if (birth === " ") {
    alert("Birth date unavailable");
    $("#birth").focus();
    return " ";
  }

  if (address === " ") {
    alert("Address unavailable");
    $("#address").focus();
    return " ";
  }

  if (enrollment === " ") {
    alert("Enrollment date unavailable");
    $("#enrollment").focus();
    return " ";
  }

  var jsonStrObj = {
    roll: roll,
    name: name,
    class: class,
    birth: birth,
    address: address,
    enrollment: enrollment
  };
  return JSON.stringify(jsonStrObj);
}

function getStudent(){
  var studentJsonObj = getStudentAsJsonObj();
  var getRequest =  createGET_BY_KEYRequest(connToken, schoolDBName, schoolRelationName, studentJsonObj);
  jQuery.ajaxSetup({async: false});
  var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({async: true});
  if (resJsonObj.status === 400) {
    $("#save").prop("disabled",false);
    $("#reset").prop("disabled",false);
    $("#name").focus();
  }
  else if (resJsonObj.status === 200) {
    $("#roll").prop("disabled", true);
    fillData(resJsonObj);

    $("#change").prop("disabled",false);
    $("#reset").prop("disabled",false);
    $("#name").focus();

  }
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === ''){
    return "";
  }
  var putRequest = createPUTRequest(connToken, jsonStrObj, schoolDBName, schoolRelationName);
  jQuery.ajaxSetup({async: false});
  var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({async: true});
  resetForm();
  $("#roll").focus();
}

function changeData() {
  $("#change").prop("disabled", true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(connToken, jsonChg, schoolDBName, schoolRelationName, localStorage.getItem("recno"));
  jQuery.ajaxSetup({async: false});
  var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({async: true});
  console.log(resJsonObj);
  resetForm();
  $("#roll").focus();
}
