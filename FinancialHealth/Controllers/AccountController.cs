using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Pages.Account.Internal;
using Microsoft.AspNetCore.Mvc;


namespace BlogPost.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        public AccountController(SignInManager<IdentityUser> signInManager )
        {
            _signInManager=signInManager;
        }
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        // [Route("api/Account/Login")]
        public IActionResult Login1()
        {
           return Content("Hi there!");
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel.InputModel model)
        {
            // if(model==null || String.IsNullOrEmpty(model.Password) || String.IsNullOrEmpty(model.Email)){
            //     return BadRequest();
            // }
            if(Request.Method.ToUpper() == "OPTIONS")
            {
                return Ok();
            }
            if(model==null || String.IsNullOrEmpty(model.Password) || String.IsNullOrEmpty(model.Email)){
                return BadRequest();
            }
            var identityUser = _signInManager.UserManager.Users.FirstOrDefault(x=>x.Email.ToUpper() == model.Email);
            if(identityUser ==null){
                return Json(new {
                    IsError = true,
                    Error = "Пользователь с данной электронной почтой не зарегистрирован"
                });
            }
            var signInResult = await _signInManager.PasswordSignInAsync(identityUser, model.Password, model.RememberMe, true);
            if(signInResult.Succeeded){
                return Json(new {
                    IsError = false
                });
            }
           return Json(new {
                    IsError = true,
                    Error = "Введён неверный пароль"
                });
        }
    }
}
