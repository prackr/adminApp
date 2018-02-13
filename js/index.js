$(document).ready(function () {

  //base api url
  let baseUrl = 'https://taskto.com/api/v1/'

  $('.otp').hide();
  $('.user').hide();
  $('.company').hide();
  $('.redirectElements').hide();
  $('#stepNumber').text(1);

  let userExists = false;
  let user = null;

  //window unload confirm
  $(window).bind('beforeunload',function() {
    return "'Are you sure you want to leave the page. All data will be lost!";
  });



  // disbaling enter btn submit
  $('form').on('keyup keypress', function(e) {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      return false;
    };
  });

  //two way data binding if user is new
  $("#cName").on("change keyup paste click", function(){
    let bizName = $('#cName').val();
    $('#cBizName').val(bizName);
  });

  //two way data binding if user is in db
  $("#cName1").on("change keyup paste click", function(){
    let bizName = $('#cName1').val();
    $('#cBizName1').val(bizName);
  });

  // toastr options
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "200",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  // $.post(baseUrl+"autocomplete/userByField",
  //     { userName: "vmreddyvmb@gmail.com"},
  //   function(data){
  //        console.log(data);
  //   }).fail(function(e){
  //       console.log("error");
  //       console.log(e);
  // });

  // $.post(baseUrl+"company/signup",
  //     { email: "vmreddyvmb@gmail.com", cName: "bizName", bizName:"abc", numOfUsers: 50},
  //   function(data){
  //        console.log(data);
  //   }).fail(function(e){
  //       console.log("error");
  //       console.log(e);
  // });





  $('#step1btn').on('click', function () {
    let email = $('#email').val();
    $('#emailToShow').text(email);
    if (email) {
      let isEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
      if (isEmail.test(email)) {
         $.post(baseUrl+"user/sendEmailToVerifyEmail",
              { email: email},
            function(data){
                console.log(data.message);
                if (data && data.data && data.data.user) {
                  user = data.data.user;
                  $('#userNameToShow').text(", "+user.firstName+" "+user.lastName);
                  userExists = true;
                };
                $('.email').hide();
                $('.otp').show();
                toastr.info("Please enter the six-digit OTP, you received in  your email "+email);
                $('#stepNumber').text(2);
            }).fail(function(){
                console.log("error in sending req to api");
                toastr.error("something went wrong!, please try again.");
        });
      } else {
        toastr.error("Invalid email, please check your email.");
      };
    } else {
      toastr.error("email is required field.");
    };
  });


  $('#step2btn').on('click', function () {
    let otp =  $('#otp').val();
    let email = $('#email').val();

    if (otp && otp.length == 6) {

      $.post(baseUrl+"user/verifyEmailOTP",
          { email: email, otp: otp},
            function(data){
                console.log(data.message);
              if (data.status == 200) {
                console.log("otp and email form hidden.");
                $('.email').hide();
                $('.otp').hide();
                console.log("user details form hidden.");
                if(userExists) {
                  let companies = data.data.companies || [];
                  for (let i = 0; i < companies.length; i++) {
                    const el = companies[i];
                    let img = 'img/dlogo.png';
                    if (el && el.settings && el.settings.logoUrl) {
                      img = el.settings.logoUrl;
                    };
                    let li = `<li id="uCompanies" class="row">
                                  <span id="uClogo" class="col-md-2 col-sm-2 col-xs-2 text-left"><img src="${img}" alt="" width="35px" height="35px"></span>
                                  <span id="uCname" class="col-md-6 col-sm-6 col-xs-6 text-left">${el.name}</span>
                                  <span class="col-md-4 col-sm-4 col-xs-4 text-right">
                                      <a id="uCLbtn" href='${"https://"+el.bizName+".taskto.com"}' targent="_blank"  class="btn btn-raised btn-info btn-md ripple-effect">Login</a>
                                  </span>
                              </li>`;
                    $('#workspaces').append(li);
                  };
                  if (companies.length <= 0) {
                    $("#workspacesP").remove();
                    $("#workspaces").remove();
                  };
                  $('#userNameToShow1').text(", "+user.firstName+" "+user.lastName);
                  $('.company').show();
                  $('#stepNumber').text(3);
                }else {
                  $('.user').show();
                };

              }else{
                toastr.error(data.message);
              };
            }).fail(function(){
                console.log("error in sending req to backend.");
      });

    }else{
      toastr.info("OTP should be six digit number.");
    };

  });


  $('#step3btn').on('click', function () {

    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let email = $('#email').val();
    let phone = $('#phone').val();
    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();
    let cName = $('#cName').val();
    let cbizName = $('#cBizName').val();
    let cNoOfUsers = $('#cNoOfUsers').val() || 10;
    let cPlan = $('#cPlan').val() || null;
    let cMessage = $('#cMessage').val() || null;

    let phoneRegex = /^[1-9][0-9]{9}$/;

    if (!firstName){
      toastr.error("Hey!, first name is required.");
    }else if (!lastName){
      toastr.error("Hey!,last name is required.");
    }else if (!password){
      toastr.error("Hey!, password is a required field.");
    }else if (!confirmPassword){
      toastr.error("Hey!, confirm password is a required field.");
    }else if (password != confirmPassword){
      toastr.error("Hey!, passwords doesn't match.");
    }else if (password.length <= 7){
      toastr.error("Hey!, password should be 8 chars long.");
    }else if (!phone){
      toastr.error("Hey!, Contact Number is required.");
    }else if (phone && !phoneRegex.test(phone)){
      toastr.error("Hey!, Contact Number is not valid mobile number.");
    }else if (!cName){
      toastr.error("Hey!,workspace name is required.");
    }else if (!cbizName){
      toastr.error("Hey!, workspace subdomain name is required.");
    }else{
      $.post(baseUrl+"company/bizNameCheck",
      { bizName:cbizName },
      function(data){
              if (data.status == 200) {
                toastr.info("workspace subdomain available.");
                //create user first , then company
                console.log("Congrats!, you completed all the steps successfully.");
              $.post(baseUrl+"user/signup",
              { firstName: firstName, lastName: lastName, phone:phone, email: email, password:password},
              function(data){
                if (data.status == 200) {
                    toastr.success("successfully created a user.");
                    toastr.info("please wait, while we create subdomain for you.");
                    //company signup process start
                      $.post(baseUrl+"company/signup",
                          { email: email, cName: cName, bizName:cbizName,
                            numOfUsers: cNoOfUsers, plan:cPlan, message:cMessage
                          },
                          function(data){
                            if (data.status == 200) {
                              $('#bizURL1').text(`https://${data.data.bizName}.taskto.com`);
                              $("a.bizURL2").attr("href", `https://${data.data.bizName}.taskto.com`);
                              $('.user').hide();
                              $('.firstCard').hide();
                              $('.step').hide();
                              $('.redirectElements').show();
                              $(window).unbind('beforeunload');
                              // toastr.info("workspace created successfully.");
                              // toastr.info("please wait, while redirect you to your workspace.");
                              setTimeout(function(){
                                $(location).attr('href',`https://${data.data.bizName}.taskto.com`);
                              }, 7000);
                            }else{
                              toastr.error(data.message);
                            };
                          }).fail(function(){
                              console.log("error in sending data to api.");
                        });

                    }else{
                      toastr.error(data.message);
                    };
                  }).fail(function(){
                      console.log("error in sending data to api.");
                });
              }else{
                toastr.error(data.message);
              };
            }).fail(function(){
                console.log("error in sending data to api.");
          });
    };

  });

  $('#step4btn').on('click', function () {

    let email = $('#email').val();
    let cName = $('#cName1').val();
    let cbizName = $('#cBizName1').val();
    let cNoOfUsers = $('#cNoOfUsers1').val() || 10;
    let cPlan = $('#cPlan1').val() || null;
    let cMessage = $('#cMessage1').val() || null;

    if (!email){
      toastr.error("Hey!, email id is required.");
    }else if (!cName){
      toastr.error("Hey!,workspace name is required.");
    }else if (!cbizName){
      toastr.error("Hey!, workspace subdomain name is required.");
    }else{
      console.log("Congrats!, you completed all the steps successfully.");
      //create user first , then company
        $.post(baseUrl+"company/signup",
          { email: email, cName: cName, bizName:cbizName,
            numOfUsers: cNoOfUsers, plan:cPlan, message:cMessage
          },
          function(data){
            if (data.status == 200) {
              $('#bizURL1').text(`https://${data.data.bizName}.taskto.com`);
              $("a.bizURL2").attr("href", `https://${data.data.bizName}.taskto.com`);
              $('.company').hide();
              $('.firstCard').hide();
              $('.step').hide();
              $('.redirectElements').show();
              $(window).unbind('beforeunload');
              // toastr.info("workspace created successfully.");
              // toastr.info("please wait, while redirect you to your workspace.");
              setTimeout(function(){
                $(location).attr('href',`https://${data.data.bizName}.taskto.com`);
              }, 7000);
            }else{
              toastr.error(data.message);
            };
          }).fail(function(){
              console.log("error in sending data to api.");
        });
    };

  });


  // material js start here
  // Ripple-effect animation
  $(".ripple-effect").click(function(e){
      var rippler = $(this);

      // create .ink element if it doesn't exist
      if(rippler.find(".ink").length == 0) {
          rippler.append("<span class='ink'></span>");
      }

      var ink = rippler.find(".ink");

      // prevent quick double clicks
      ink.removeClass("animate");

      // set .ink diametr
      if(!ink.height() && !ink.width())
      {
          var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
          ink.css({height: d, width: d});
      }

      // get click coordinates
      var x = e.pageX - rippler.offset().left - ink.width()/2;
      var y = e.pageY - rippler.offset().top - ink.height()/2;

      // set .ink position and add class .animate
      ink.css({
        top: y+'px',
        left:x+'px'
      }).addClass("animate");
  })


});
