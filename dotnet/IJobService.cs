namespace Services.Interfaces
{
    public interface IJobService
    {
        public Job Get(int id);
        public List<Job> GetAll();
        public Paged<Job> Pagination(int pageIndex, int pageSize);
        public Paged<Job> SearchPaginated(int pageIndex, int pageSize, string query);
    
        public void Update(JobUpdateRequest request, int userId);
        public void Delete(int id);
        public int Add(JobAddRequest request, int userId);
    }
}
