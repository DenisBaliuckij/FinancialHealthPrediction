using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Pages.Account.Internal;
using Microsoft.AspNetCore.Mvc;
using BlogPost.Models;
using BlogPost.Data;
using System.Data.SqlClient;

namespace BlogPost.Controllers
{
    public class CompaniesController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        public CompaniesController(SignInManager<IdentityUser> signInManager )
        {
            _signInManager=signInManager;
        }


        [HttpGet]
        public async Task<IActionResult> GetRequests([FromQuery] GetRequestsModel model){
            if(string.IsNullOrEmpty(model.UserEmail) || string.IsNullOrEmpty(model.HashedPassword))
            {
                return Json(new {
                    IsError = true,
                    Error = "Вы неавторизированы",
                    RedirectToLogin = true
                });
            }
            var identityUser = await _signInManager.UserManager.FindByNameAsync(model.UserEmail);
            if(identityUser ==null){
                return Json(new {
                    IsError = true,
                    Error = "Пользователь не найден",
                    RedirectToLogin = true
                });
            }
            var decryptedPassword = StringEncryptor.DecryptString(model.HashedPassword, "TOMSK2018");
            var signInResult = await _signInManager.PasswordSignInAsync(identityUser, decryptedPassword, false, true); 
            try
            {
                if(signInResult.Succeeded)
                {
                    using(var connection = new SqlConnection("Server=localhost,1433;Database=aspnet-BlogPost-3BDC69D5-9F9E-443F-96EC-0E1B2326A0AE;user id=SA;password=qwerty123!"))
                    {
                        var commandText = "SELECT * FROM Companies WHERE userName = '"+model.UserEmail+"'";
                        SqlCommand command = new SqlCommand(commandText, connection);
                        command.Connection.Open();
                        SqlDataReader reader = command.ExecuteReader();
                        IList<RequestsEntryModel> results = new List<RequestsEntryModel>();
                        while (reader.Read())
                        {
                            var request = new RequestsEntryModel(){
                                Id =  reader["id"].ToString(),
                                Inn = reader["inn"].ToString(),
                                Name = reader["name"].ToString(),
                                Address = reader["address"].ToString(),
                               
                            };
                            if(!string.IsNullOrEmpty(reader["isFound"].ToString())){
                                
                                request.IsFound = reader["isFound"].ToString()=="1";
                            }
                            if(!string.IsNullOrEmpty(reader["positiveProbability"].ToString())){
                                decimal parseResultsDecimal = 0;
                                decimal.TryParse(reader["positiveProbability"].ToString(), out parseResultsDecimal);
                                request.PositiveProbability = parseResultsDecimal;
                            }
                            results.Add(request);
                        }           
                        return Json(new {
                            IsError = false,
                            Results = results
                        });
            }
            }
            }
            catch(Exception ex){
                var a = 2;
            }
            return Json(new {
                IsError = true,
                Error = "Ошибка связи с БД",
            });
        }

        [HttpPost]
        public async Task<IActionResult> AddRequest([FromBody] AddRequestModel model){
            if(string.IsNullOrEmpty(model.UserEmail) || string.IsNullOrEmpty(model.HashedPassword))
            {
                return Json(new {
                    IsError = true,
                    Error = "Вы неавторизированы",
                    RedirectToLogin = true
                });
            }
            var identityUser = await _signInManager.UserManager.FindByNameAsync(model.UserEmail);
            if(identityUser ==null){
                return Json(new {
                    IsError = true,
                    Error = "Пользователь не найден",
                    RedirectToLogin = true
                });
            }
            var decryptedPassword = StringEncryptor.DecryptString(model.HashedPassword, "TOMSK2018");
            var signInResult = await _signInManager.PasswordSignInAsync(identityUser, decryptedPassword, false, true); 
            try
            {
                if(signInResult.Succeeded)
                {
                    using(var connection = new SqlConnection("Server=localhost,1433;Database=aspnet-BlogPost-3BDC69D5-9F9E-443F-96EC-0E1B2326A0AE;user id=SA;password=qwerty123!"))
                    {
                        var commandText = "INSERT INTO COMPANIES (INN, Address, Name, userName) VALUES ('"+model.Inn+"',N'"+model.Address+"',N'"+model.Name+"','"+model.UserEmail+"');";
                        SqlCommand command = new SqlCommand(commandText, connection);
                        command.Connection.Open();
                        command.ExecuteNonQuery();
                    }
                    return Json(new {
                       IsError = false,
                    });
            }
            }
            catch(Exception ex){
                var a = 2;
            }
            return Json(new {
                IsError = true,
                Error = "Ошибка связи с БД",
            });
        }
    }
}