using System;

namespace BlogPost.Models
{
    public class GetRequestsModel
    {
        public string UserEmail { get; set; }
        public string HashedPassword {get;set;}
    }
}