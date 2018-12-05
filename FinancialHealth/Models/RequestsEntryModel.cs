using System;

namespace BlogPost.Models
{
    public class RequestsEntryModel
    {
        public string Id {get;set;}
        public string Inn { get; set; }
        public string Name {get;set;}
        public string Address {get;set;}
        public bool? IsFound {get;set;}
        public decimal? PositiveProbability {get;set;}
    }
}