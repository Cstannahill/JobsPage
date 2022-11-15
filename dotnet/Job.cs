namespace Models.Domain.Jobs
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Summary { get; set; }
        public string Pay { get; set; }
        public string Slug { get; set; }
        public int StatusId { get; set; }
        public int UserId { get; set; }
        public Image PrimaryImage { get; set; }
        public List<Skill> Skills { get; set; }
        public int TechCompanyId { get; set; }
        public string TechCompanyName { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime DateCreated  { get; set; }

        public List<Friend> PossibleCandidates { get; set; }

    }
}
