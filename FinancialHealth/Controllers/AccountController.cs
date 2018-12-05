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
     
      

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel.InputModel model)
        {
            if(model==null || String.IsNullOrEmpty(model.Password) || String.IsNullOrEmpty(model.Email)){
                return BadRequest();
            }
            var identityUser = await _signInManager.UserManager.FindByNameAsync(model.Email);
            if(identityUser ==null){
                return Json(new {
                    IsError = true,
                    Error = "Пользователь с данной электронной почтой не зарегистрирован"
                });
            }
            var signInResult = await _signInManager.PasswordSignInAsync(identityUser, model.Password, model.RememberMe, true);
            if(signInResult.Succeeded){
                return Json(new {
                    IsError = false,
                    HashedPassword = StringEncryptor.EncryptString(model.Password, "TOMSK2018")
                });
            }
           return Json(new {
                    IsError = true,
                    Error = "Введён неверный пароль"
                });
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterModel.InputModel model)
        {
            if(model==null || String.IsNullOrEmpty(model.Password) || String.IsNullOrEmpty(model.ConfirmPassword) ||String.IsNullOrEmpty(model.Email)){
                return BadRequest();
            }
            if(model.Password!=model.ConfirmPassword){
                 return Json(new {
                    IsError = true,
                    Error = "Введённые пароли не совпадают"
                });
            }
            var identityUser = new IdentityUser { UserName = model.Email };         
            var identityResults = await _signInManager.UserManager.CreateAsync(identityUser, model.Password);
            if(!identityResults.Succeeded){
                return Json(new {
                    IsError = true,
                    Error = "При создании нового пользователя произошла ошибка. Убедитесь, что выбранный вами пароль содержит не менее 6 символов"
                });
            }
            return Json(new {
                    IsError = false
                });
        }
    }
}
