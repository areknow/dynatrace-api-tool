$(function() {
  
  
  var showtoast = new ToastBuilder(); 
  
  
//  $("input[name='keyword']").on("input", mark());
  

  // login form submit button action
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
        setTimeout(function() {
//          showtoast('Authentication successfull')
          hideLogin(true)
        },1500)
        initWayPoints();
      });
      
      
      
      
    } else {
      showWarning(true,'Please fill out all fields')
    }
  })
  
  
  // radio button click actions
  $('input:radio[name="env-type"]').click(function() {
    if($(this).attr('value') == 'managed') {
      $('#managed-domain-wrapper').slideDown();     
      $('#login-form').css('height','544px');
    } else {
      $('#managed-domain-wrapper').slideUp();  
      $('#login-form').css('height','468px'); 
    }
  });
  
  
  // copy button click actions
  $('.copy-button').click(function() {
    var parent = $(this).closest('article').children('.print-wrapper').children('.print-json')
    copyToClipboard(parent.attr('id'))
  })
  
  
  // anchor scroll
  $('a[href*=#]:not([href=#])').click(function(e) {
    $('.sidebar a').removeClass('is-active')
    $(this).addClass('is-active')
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
    && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top -114
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
    url = 'https://'+data.id+'.live.dynatrace.com/api/v1/'
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


// hide and show login screen
function hideLogin(bool) {
  if(bool) {
    $('.auth-wrapper').slideUp()
  } else {
    $('.auth-wrapper').slideDown()
  }
}


// ajax calls for mainlist
function ajaxTimeseries(url,token) {
  request = 'timeseries';
  return $.ajax({
    url : url+request+'?Api-Token='+token
  }).done(function(data) {
    var endpoint = url+request+'?Api-Token='+token
    var myJSON = JSON.stringify(data)
    $('#timeseries .endpoint').html(endpoint)
    $('#timeseries .print-json').html(myJSON)
  })
}
function ajaxProblemStatus(url,token) {
  request = 'problem/status';
  return $.ajax({
    url : url+request+'?Api-Token='+token
  }).done(function(data) {
    var endpoint = url+request+'?Api-Token='+token
    var myJSON = JSON.stringify(data)
    $('#problem-status .endpoint').html(endpoint)
    $('#problem-status .print-json').html(myJSON)
  })
}
function ajaxProblemFeed(url,token) {
  request = 'problem/feed';
  return $.ajax({
    url : url+request+'?Api-Token='+token
  }).done(function(data) {
    var endpoint = url+request+'?Api-Token='+token
    var myJSON = JSON.stringify(data)
    $('#problem-feed .endpoint').html(endpoint)
    $('#problem-feed .print-json').html(myJSON)
  })
}
function ajaxApplications(url,token) {
  request = '/entity/applications';
  return $.ajax({
    url : url+request+'?Api-Token='+token,
  }).done(function(data) {
    var endpoint = url+request+'?Api-Token='+token
    var myJSON = JSON.stringify(data)
    $('#applications .endpoint').html(endpoint)
    $('#applications .print-json').html(myJSON)
  })
}
function ajaxServices(url,token) {
  request = 'entity/services';
  return $.ajax({
    url : url+request+'?Api-Token='+token,
  }).done(function(data) {
    var endpoint = url+request+'?Api-Token='+token
    var myJSON = JSON.stringify(data)
    $('#services .endpoint').html(endpoint)
    $('#services .print-json').html(myJSON)
  })
}
function ajaxHosts(url,token) {
  request = 'entity/infrastructure/hosts';
  return $.ajax({
    url : url+request+'?Api-Token='+token,
  }).done(function(data) {
    var endpoint = url+request+'?Api-Token='+token
    var myJSON = JSON.stringify(data)
    $('#hosts .endpoint').html(endpoint)
    $('#hosts .print-json').html(myJSON)
  })
}
function ajaxProcessGroups(url,token) {
  request = 'entity/infrastructure/process-groups';
  return $.ajax({
    url : url+request+'?Api-Token='+token,
  }).done(function(data) {
    var endpoint = url+request+'?Api-Token='+token
    var myJSON = JSON.stringify(data)
    $('#process-groups .endpoint').html(endpoint)
    $('#process-groups .print-json').html(myJSON)
  })
}


// initialize the scrolling waypoints 
function initWayPoints() {
  var waypoint1 = new Waypoint({
    element: document.getElementById('problem-status'),
    handler: function(direction) {
      if (direction=="down") {
        $('.sidebar a').removeClass('is-active')
        $('#side-problem-status').addClass('is-active')
        $('.breadcrumbs__last').html('Problem Status')
      } else if (direction=="up") {
        $('#side-problem-status').removeClass('is-active')
        $('#side-timeseries').addClass('is-active')
        $('.breadcrumbs__last').html('Timeseries')
      }
    },
    offset: 200
  });
  var waypoint2 = new Waypoint({
    element: document.getElementById('problem-feed'),
    handler: function(direction) {
      if (direction=="down") {
        $('.sidebar a').removeClass('is-active')
        $('#side-problem-feed').addClass('is-active')
        $('.breadcrumbs__last').html('Problem Feed')
      } else if (direction=="up") {
        $('#side-problem-feed').removeClass('is-active')
        $('#side-problem-status').addClass('is-active')
        $('.breadcrumbs__last').html('Problem Status')
      }
    },
    offset: 200
  });
  var waypoint3 = new Waypoint({
    element: document.getElementById('applications'),
    handler: function(direction) {
      if (direction=="down") {
        $('.sidebar a').removeClass('is-active')
        $('#side-applications').addClass('is-active')
        $('.breadcrumbs__last').html('Applications')
      } else if (direction=="up") {
        $('#side-applications').removeClass('is-active')
        $('#side-problem-feed').addClass('is-active')
        $('.breadcrumbs__last').html('Problem Feed')
      }
    },
    offset: 200
  });
  var waypoint3 = new Waypoint({
    element: document.getElementById('services'),
    handler: function(direction) {
      if (direction=="down") {
        $('.sidebar a').removeClass('is-active')
        $('#side-services').addClass('is-active')
        $('.breadcrumbs__last').html('Services')
      } else if (direction=="up") {
        $('#side-services').removeClass('is-active')
        $('#side-applications').addClass('is-active')
        $('.breadcrumbs__last').html('Applications')
      }
    },
    offset: 200
  });
  var waypoint4 = new Waypoint({
    element: document.getElementById('hosts'),
    handler: function(direction) {
      if (direction=="down") {
        $('.sidebar a').removeClass('is-active')
        $('#side-hosts').addClass('is-active')
        $('.breadcrumbs__last').html('Hosts')
      } else if (direction=="up") {
        $('#side-hosts').removeClass('is-active')
        $('#side-services').addClass('is-active')
        $('.breadcrumbs__last').html('Services')
      }
    },
    offset: 200
  });
  var waypoint5 = new Waypoint({
    element: document.getElementById('process-groups'),
    handler: function(direction) {
      if (direction=="down") {
        $('.sidebar a').removeClass('is-active')
        $('#side-process-groups').addClass('is-active')
        $('.breadcrumbs__last').html('Process Groups')
      } else if (direction=="up") {
        $('#side-process-groups').removeClass('is-active')
        $('#side-hosts').addClass('is-active')
        $('.breadcrumbs__last').html('Hosts')
      }
    },
    offset: 200
  });
}


// create a selection range and copy the text to clipboard
function copyToClipboard(containerid) {
  if (document.selection) { 
    document.getSelection().removeAllRanges();
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select().createTextRange();
    document.execCommand("Copy"); 
  } else if (window.getSelection) {
    window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().addRange(range);
    document.execCommand("Copy");
  }
}


//function mark() {
//
//    // Read the keyword
//    var keyword = $("input[name='keyword']").val();
//
//    // Determine selected options
//    var options = {};
//    $("input[name='opt[]']").each(function() {
//      options[$(this).val()] = $(this).is(":checked");
//    });
//
//    // Remove previous marked elements and mark
//    // the new keyword inside the context
//    $(".context").unmark({
//      done: function() {
//        $(".context").mark(keyword, options);
//      }
//    });
//  };










function ToastBuilder(options) {
  var opts = options || {};
  opts.defaultText = opts.defaultText || 'default text';
  opts.displayTime = opts.displayTime || 3000;
  opts.target = opts.target || 'body';

  return function (text) {
    $('<div/>')
    .addClass('toast')
    .prependTo($(opts.target))
    .text(text || opts.defaultText)
    .queue(function(next) {
      $(this).css({
        'opacity': 1
      });
      var topOffset = 15;
      $('.toast').each(function() {
        var $this = $(this);
        var height = $this.outerHeight();
        var offset = 15;
        $this.css('top', topOffset + 'px');
        topOffset += height + offset;
      });
      next();
    })
    .delay(opts.displayTime)
    .queue(function(next) {
      var $this = $(this);
      var width = $this.outerWidth() + 20;
      $this.css({
        'right': '-' + width + 'px',
        'opacity': 0
      });
      next();
    })
    .delay(600)
    .queue(function(next) {
      $(this).remove();
      next();
    });
  };
}