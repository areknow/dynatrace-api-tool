$(function() {
  
  

  
  // login form submit button
  $('#submit-form').click(function() {
    if (checkForm()) {
      $('.warning').fadeOut('fast')
      showLoader(true);
      var formObject = collectForm();
      var url = buildURL(formObject);
      getData(url,formObject.token,'/entity/services').then(function(res) {
        console.log('services')
        console.log(res)
        showLoader(false)
      })
    } else {
      $('.warning').html('Please fill out all fields')
      $('.warning').fadeIn('fast')
    }
  })
  
  
  // radio click
  $('input:radio[name="env-type"]').click(function() {
    if($(this).attr('value') == 'managed') {
      $('#managed-domain-wrapper').slideDown();     
      $('#login-form').css('height','516px');
    } else {
      $('#managed-domain-wrapper').slideUp();  
      $('#login-form').css('height','440px'); 
    }
  });
  
  
})// end doc ready












// get the form element values
function collectForm() {
  var envType = $("input:radio[name='env-type']:checked").val();
  var managedDomain = $('#text-managed-domain').val();
  var envID = $('#text-env-id').val();
  var apiToken = $('#text-api-token').val();
  var data = {
    type:envType, 
    domain:managedDomain, 
    id:envID, 
    token:apiToken};
  return data;
}


// validate the form
function checkForm() {
  var managedDomain = $('#text-managed-domain').val();
  var envID = $('#text-env-id').val();
  var apiToken = $('#text-api-token').val();
  var checkedRadio = $('input:radio[name="env-type"]:checked').attr('value');
  if (checkedRadio == 'managed') {
    if (managedDomain == "" || envID == "" || apiToken == "") {
      return false;
    } else { return true; }
  } else {
    if (envID == "" || apiToken == "") {
      return false;
    } else { return true; }
  }
  return false;
}


// build the url request 
function buildURL(data) {
  var url;
  if (data.type == "saas") {
    url = 'https://'+data.id+'.live.dynatrace.com/api/v1'
  } else if (data.type == "managed") {
    url = 'https://'+data.domain+'/e/'+data.id+'/api/v1/'
  }
  return url;
}


// return a promise for the API request
function getData(url,token,request) {
  return Promise.resolve($.ajax({
    url : url+request,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Api-Token "+token)
    }
  }));
}


// show or hide the loading spinner
function showLoader(bool) {
  if (bool) {
    $('.loading').fadeIn()
  } else {
    setTimeout(function(){ 
      $('.loading').fadeOut();
    }, 3000);
  }
}


















//get the data from the API request in promise form
//function getData(token,type) {
//  return Promise.resolve($.ajax({
//    url : 'https://dynatrace-managed.dxs-platform.com/e/00cdfdb4-e9e4-4a4f-b2b7-8a20b3277321/api/v1/'+type,
//    beforeSend: function(xhr) {
//      xhr.setRequestHeader("Authorization", "Api-Token "+token)
//    }
//  }));
//}


//var APItoken = 'AiRaV1BdRGWaPc6UPUzNX';

//getData(APItoken,'entity/services').then(function(res) {
//  console.log('services')
//  console.log(res)
//})
//getData(APItoken,'problem/feed').then(function(res) {
//  console.log('problem feed')
//  console.log(res)
//})
//getData(APItoken,'entity/applications').then(function(res) {
//  console.log('applications')
//  console.log(res)
//})
//
//getData(APItoken,'entity/infrastructure/hosts').then(function(res) {
//  console.log('hosts')
//  console.log(res)
//})
