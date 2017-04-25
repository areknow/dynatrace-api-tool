

$(function() {
  
  


  
  // login form submit button
  $('#submit-form').click(function() {
    if (checkForm()) {
      showWarning(false)
      showLoader(true);
      var formObject = collectForm();
      var url = buildURL(formObject);
      $.when(ajaxTimeseries(url,formObject.token),
             ajaxProblemStatus(url,formObject.token),
             ajaxProblemFeed(url,formObject.token),
             ajaxApplications(url,formObject.token),
             ajaxServices(url,formObject.token),
             ajaxHosts(url,formObject.token),
             ajaxProcessGroups(url,formObject.token)
            ).done(function(a1,a2,a3,a4,a5,a6,a7){
        console.log(a1)
        console.log(a2)
        console.log(a3)
        console.log(a4)
        console.log(a5)
        console.log(a6)
        console.log(a7)
        showLoader(false)
        hideLogin(true)
      });
      
      
 
      
//      getData(url,token,'/entity/applications').then(function(res) {
//        console.log(res)
//        showLoader(false)
//        hideLogin(true)
//        ajaxIsDone = true;
//      }).catch(function(rejected){
//        showWarning(true,'Something went wrong, please verify your information')
//        showLoader(false)
//      });
      
      
      
      
    } else {
      showWarning(true,'Please fill out all fields')
    }
  })
  
  
  // radio button click
  $('input:radio[name="env-type"]').click(function() {
    if($(this).attr('value') == 'managed') {
      $('#managed-domain-wrapper').slideDown();     
      $('#login-form').css('height','544px');
    } else {
      $('#managed-domain-wrapper').slideUp();  
      $('#login-form').css('height','468px'); 
    }
  });
  
  
  //anchor scroll
  $('a[href*=#]:not([href=#])').click(function(e) {
    $('.sidebar a').removeClass('is-active')
    $(this).addClass('is-active')
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
    && location.hostname == this.hostname) {
      var target = $(this.hash);
      target.addClass('active');
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top -90
        }, 500);
        return false;
      }
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
    url : url+request+'?Api-Token='+token
  }));
}


// show or hide the loading spinner
function showLoader(bool) {
  if (bool) {
    $('.loading').fadeIn()
  } else {
    setTimeout(function(){ 
      $('.loading').fadeOut();
    }, 1000);
  }
}


// present an error message
function showWarning(bool,message) {
  $('.warning').html(message)
  if (bool) {
    $('.warning').fadeIn('fast')
  } else {
    $('.warning').fadeOut('fast')
  }
}



function hideLogin(bool) {
  if(bool) {
    $('.auth-wrapper').slideUp()
  } else {
    $('.auth-wrapper').slideDown()
  }
}



//function getApplications(url,token) {
//  getData(url,token,'/entity/applications').then(function(res) {
//    console.log(res)
//  }).catch(function(rejected){
//  });
//}



function ajaxTimeseries(url,token) {
  request = '/timeseries';
  return $.ajax({
    url : url+request+'?Api-Token='+token
  }).done(function(data) {
//    console.log(data)
    var myJSON = JSON.stringify(data)
    console.log(myJSON)
    $('#timeseries .print-json').html(myJSON)
  })
}
function ajaxProblemStatus(url,token) {
  request = '/problem/status';
  return $.ajax({
    url : url+request+'?Api-Token='+token
  })
}
function ajaxProblemFeed(url,token) {
  request = '/problem/feed';
  return $.ajax({
    url : url+request+'?Api-Token='+token
  })
}
function ajaxApplications(url,token) {
  request = '/entity/applications';
  return $.ajax({
    url : url+request+'?Api-Token='+token,
  })
}
function ajaxServices(url,token) {
  request = '/entity/services';
  return $.ajax({
    url : url+request+'?Api-Token='+token,
  })
}
function ajaxHosts(url,token) {
  request = '/entity/infrastructure/hosts';
  return $.ajax({
    url : url+request+'?Api-Token='+token,
  })
}
function ajaxProcessGroups(url,token) {
  request = '/entity/infrastructure/process-groups';
  return $.ajax({
    url : url+request+'?Api-Token='+token,
  })
}




//function jsonCallback(json){
//  console.log(json);
//}
//
//$.ajax({
//  url: "http://run.plnkr.co/plunks/v8xyYN64V4nqCshgjKms/data-2.json",
//  dataType: "jsonp"
//});




//requests 
// 'entity/services'
// 'problem/feed'
// 'entity/applications'
// 'hosts'