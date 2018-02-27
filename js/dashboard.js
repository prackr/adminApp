
  //base api url
  let baseUrl = 'https://taskto.com/api/v1/';

   //companies load start
   function getWS(token, page) {
    if(!page){
      page = 1
    };
    $.get(baseUrl+"company/all/"+page+"?token="+token,
      {},
      function(data){
        if(data && data.status == 200){
          $('.email').hide();
          $('.firstCard').hide();
          $('.pLogo').hide();
          $('.loaderSpinnerParent').hide();
          $('.paginationDiv').show();
          $('.dashboard').show();
          $('#total').html(data.data.total || 0);
          $('#pagination').html(null);
          for (let index = 0; index < data.data.totalPages || 0; index++) {
            if (index == (parseInt(page - 1))) {
              $('#pagination').append(
                `
                <li class="active"><a href="#">${index+1}</a></li>
                `
              );
            } else {
              $('#pagination').append(
                `
                <li><a href="#" onClick='getThisPage(${index+1})'>${index+1}</a></li>
                `
              );
            }
          };
          $('#footerDiv').html(
            `
             <footer class="text-center footer"><h4>© All Rights Reserved. Prackr</h4></footer>
             `
          );

          $('#cTable').html(null);

          if (data && data.data && data.data.companies) {
            data.data.companies.forEach(el => {
              // console.log(el);
              let elString = JSON.stringify(el);
              $('#cTable').append(
  `<tr>
  <td class="text-bold">${el.name}</td>
  <td class="text-bold">${el.bizName}</td>
  <td>
  <span class="table__td"><b>Name</b> : <span class='name'>${el.createdBy.firstName + " " +el.createdBy.lastName}</span> <br /></span>
  <span class="table__td"><b>Email </b> : <span class='email1'>${el.createdBy.email}</span> <br /></span>
  <span class="table__td"><b>Mobile</b> : <span class='mobile'>${el.createdBy.phone}</span></span>
  </td>
  <td>
  <span class="table__td"><span class="text-bold">Created:</span>: <span>${el.createdAt}</span> <br /></span>
  <span class="table__td"><span class="text-bold">Expire's:</span>: <span>${el.expiryDate}</span> <br /></span>
  <span class="table__td"><span class="text-bold">Day's Left:</span>: <span>${el.expiresIn}</span> <br /></span>
  </td>
  <td>
  <span class="table__td"> <span class="text-bold">By User</span>: <span>${el.numOfUsersByUser}</span> <br /></span>
  <span class="table__td"><span class="text-bold">Num Of Licenses</span>: <span>${el.numOfUsers}</span> <br /></span>
  <span class="table__td"><span class="text-bold">Current Staffs</span>: <span>${el.staffLength}</span> <br /></span>
  </td>
  <td class="text-center">
  <span class="text-bold">${el.isActive}</span> <br /> <br /><br />
  <span><label class="switch">
  <input type="checkbox" ${CheckIfActive(el.isActive)} onClick='updateWS(${elString}, true)'
  value='${el.isActive == 'Active'?'on':'off'}'>
  <span class="slider"></span>
  </label></span>
  </td>
  <td>${el.plan}</td>
  <td>${el.message}</td>
  <td><button class="btn btn-info" data-toggle="modal" data-target="#editModal"  onClick='openModal(${elString})' >Edit</button></td>
  </tr>
  `
              );
            });
          };

        }else{
          toastr.error(data.message);
          // console.log(data.message);
          localStorage.removeItem('token');
          $('.loaderSpinnerParent').hide();
          $('.loaderSpinner').hide();
          $('.dashboard').hide();
          $('.email').show();
          $('.firstCard').show();
          $('.pLogo').show();
        };
  });
};
  //companies load end

$(document).ready(function () {


  // $('.email').hide();
  $('.paginationDiv').hide();
  $('.footer').hide();
  $('.dashboard').hide();
  $('.loaderSpinnerParent').show();


  // disbaling enter btn submit
  $('form').on('keyup keypress', function(e) {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      return false;
    };
  });

  //CheckIfActive
  function CheckIfActive(isActive) {
    // console.log(isActive);
    if (isActive == 'Active') {
      return 'checked'
    }else{
      return ''
    };
  };








  // localStorage.removeItem("token");

  //if token show dashboard start
  let tokenFromLS  = localStorage.getItem('token');
  if(tokenFromLS){
    // $('.email').hide();
    // $('.firstCard').hide();
    // $('.pLogo').hide();
    // $('.dashboard').hide();
    // $('.loaderSpinner').show();
     getWS(tokenFromLS);
  }else{
    $('.email').show();
    $('.firstCard').show();
    $('.pLogo').show();
    $('.dashboard').hide();
    $('.loaderSpinnerParent').hide();
  };
  //if token show dashboard end


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


  $('#step1btn').on('click', function () {
    let email = $('#email').val();
    let password = $('#password').val();
    if (email && password) {
      let isEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
      if (isEmail.test(email)) {
        $.post(baseUrl+"company/adminLogin",
        { email: email, password: password},
      function(data){
        console.log(data);
          if(data && data.status == 200){
            toastr.info(data.message);
            // console.log(data);
            localStorage.setItem("token", data.data.token);
            // console.log(localStorage);
            //get all workspaces from db paginated
            let token = localStorage.getItem("token");
            getWS(token);
          }else{
            toastr.error(data.message);
          };
      }).fail(function(){
          console.log("error in sending req to api");
          toastr.error("something went wrong!, please try again.");
    });
      } else {
        toastr.error("Invalid email, please check your email.");
      };
    } else {
      toastr.error("Email & Password are required fields.");
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

  // modal start
  function openModal(el){
    // console.log(el);
    let elString = JSON.stringify(el);

    console.log("edit modal opened");
    // $('.modal-body').text("sare jahache accha hinduastan hamara");
    $('#modalP').html(
    `
     <form role="form" class="text-center">
      <div class="form-group">
        <input type="number" class="form-control" value=${el.numOfUsers}  id="NoOfUsersToEdit" required>
        <span class="form-highlight"></span>
        <span class="form-bar"></span>
        <label class="float-label" for="NoOfUsersToEdit">Number Of Licenses</label>
      </div>
      <div class="form-group">
        <input type="date" class="form-control"  id="expiryDateToEdit" required>
        <span class="form-highlight"></span>
        <span class="form-bar"></span>
        <label class="float-label" for="expiryDateToEdit">Expiry Date</label>
      </div>
      <div>Status:</div> <br />
      <div class="displayBlock">
      <span>
      <span><label class="switch">
      <input type="checkbox" ${CheckIfActive(el.isActive)} id="WSEisActive" value='${el.isActive == 'Active'?'on':'off'}'>
      <span class="slider"></span>
      </label></span></span>
      </div>
      <button type="button" class="btn btn-raised btn-info btn-lg ripple-effect "
        onClick='updateWS(${elString}, false)'>Update</button>
    </form>
    `);
    $('#ecName').append(el.name);
    $('#ecBizName').append(el.bizName);
    if (el.expiryDate) {
      document.getElementById("expiryDateToEdit").valueAsDate = new Date(el.expiryDate);
    } else {
      document.getElementById("expiryDateToEdit").valueAsDate = new Date();
    };
  };
  //modal end

  //CheckIfActive
  function CheckIfActive(isActive) {
    // console.log(isActive);
    if (isActive == 'Active') {
      return 'checked'
    }else{
      return ''
    };
  };

  //function to update workspace
  function updateWS(el, toggle) {

    let token = localStorage.getItem("token");


    if (toggle == true) {
      if (el.isActive == 'Active') {
         el.isActive = false;
      } else {
        el.isActive = true;
      };
      $.post(baseUrl+"company/update?token="+token,
      { bizName:el.bizName, isActive:el.isActive  },
      function(data){
      console.log(data);
        if(data && data.status == 200){
          toastr.info(data.message);
          // console.log(data);
          location.reload();
        }else{
          toastr.error(data.message);
        };
      }).fail(function(){
          console.log("error in sending req to api");
          toastr.error("something went wrong!, please try again.");
    });
    }else{

      let isActive = $('#WSEisActive').val();
      let expiryDate = $('#expiryDateToEdit').val();
      let numOfUsers = $('#NoOfUsersToEdit').val();
      if(isActive == 'on'){
        isActive = true;
      }else if (isActive == 'off'){
        isActive = false;
      };

      $.post(baseUrl+"company/update?token="+token,
      { bizName:el.bizName, numOfUsers: numOfUsers,
        isActive: isActive,expiryDate: expiryDate },
      function(data){
      console.log(data);
        if(data && data.status == 200){
          toastr.info(data.message);
          // console.log(data);
          location.reload();
        }else{
          toastr.error(data.message);
        };
      }).fail(function(){
          console.log("error in sending req to api");
          toastr.error("something went wrong!, please try again.");
    });
    };

  };



//checkk box value set func
  $(document).on("click","input[type='checkbox']", function(e){
    if (e.target.value == 'on') {
      e.target.value = 'off';
    }else{
      e.target.value = 'on';
    };
});
//checkk box value set func
$(document).on("click","#logout", function(e){
  let token = localStorage.getItem('token');

    $.post(baseUrl+"company/adminLogout?token="+token,
    {  },
    function(data){
      // console.log(data);
      location.reload();
      if(data && data.status == 200){
        toastr.info(data.message);
        localStorage.removeItem('token');
      }else{
        toastr.error(data.message);
      };
    }).fail(function(){
        console.log("error in sending req to api");
        toastr.error("something went wrong!, please try again.");
  });
});


   //getThisPage
  function getThisPage(page) {
  let token = localStorage.getItem('token');
  getWS(token, page);
};


