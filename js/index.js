$(document).ready(function () {
  //base api url
  let baseUrl = 'http://localhost:9000/api/v1/'
  $('.otp').hide();
  $('.companyDetails').hide();

  // disbaling enter btn submit
  $('form').on('keyup keypress', function(e) {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      return false;
    };
  });

  // toastr options
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-bottom-left",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
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
    if (email) {
      let isEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
      if (isEmail.test(email)) {
        $('.email').hide();
        $('.otp').show();
        toastr.info("Please enter the six-digit OTP, you received in  your email "+email);
        $.post(baseUrl+"user/sendEmailToVerifyEmail",
              { email: email},
            function(data){
                console.log(data);
            }).fail(function(e){
                console.log("error");
                console.log(e);
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
                console.log(data);
              if (data.status == 200) {
                console.log("otp and email form hidden.");
                $('.email').hide();
                $('.otp').hide();
                console.log("user details form hidden.");
                $('.user').show();

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


  $('#submitUserDetails').on('click', function () {
    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();

    if (!firstName){
      toastr.error("Hey!, passwords doesn't match.");
    }else if (!lastName){
      toastr.error("Hey!, passwords doesn't match.");
    }else if (!password){
      toastr.error("Hey!, passwords doesn't match.");
    }else if (!confirmPassword){
      toastr.error("Hey!, passwords doesn't match.");
    }else if (password != confirmPassword){
      toastr.error("Hey!, passwords doesn't match.");
    }else if (password.length <= 7){
      toastr.error("Hey!, password should be 8 chars long.");
    }else{
      console.log("Congrats!, you passed all the tests successfully.");
      console.log("user details form has been hidden.");
      $('.userDetails').hide();
      $('.companyDetails').show();
      $('#step3').stop().removeClass('step--current');
      $('#step4').stop().addClass('step--current');
    };

  });


});
