using System;

namespace BlogPost.Models
{
    public class AddRequestModel
    {
        public string Inn { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string UserEmail { get; set; }
        public string HashedPassword {get;set;}
    }
}