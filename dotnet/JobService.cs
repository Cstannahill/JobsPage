namespace Services
{
    public class JobService : IJobService
    {
        IDataProvider _data = null;

        public JobService(IDataProvider data)
        {
            _data = data;
        }

        public Job Get(int id)
        {
            string procName = "[dbo].[Jobs_SelectById]";
            Job job = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                job = MapSingleJob(reader, ref startingIndex);
            }
            );
            return job;
        }

        public List<Job> GetAll()
        {
            string procName = "dbo.Jobs_SelectAll";
            List<Job> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Job job = MapSingleJob(reader, ref startingIndex);
                job.PossibleCandidates = reader.DeserializeObject<List<Friend>>(startingIndex);

                if (list == null)
                {
                    list = new List<Job>();
                }

                list.Add(job);

            });
            return list;
        }

        public Paged<Job> Pagination(int pageIndex, int pageSize)
        {
            string procName = "dbo.Jobs_SelectPaginated";
            Paged<Job> pagedList = null;
            List<Job> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Job job = MapSingleJob(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex);

                    if (list == null)
                    {
                        list = new List<Job>();
                    }
                    list.Add(job);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Job>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Job> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            string procName = "dbo.Jobs_SearchPagination";
            Paged<Job> pagedList = null;
            List<Job> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Job job = MapSingleJob(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex);

                    if (list == null)
                    {
                        list = new List<Job>();
                    }
                    list.Add(job);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Job>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public int Add(JobAddRequest request, int userId)
        {
            int id = 0;

            DataTable dt = new DataTable();
            dt.Columns.Add("Name", typeof(string));
            foreach (string skill in request.Skills)
            {


                DataRow dr = dt.NewRow();
                dr.SetField(0, skill);
                dt.Rows.Add(dr);
            }
            string procName = "[dbo].[Jobs_InsertBatch]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(request, col);
                col.AddWithValue("@batchSkills", dt);
                col.AddWithValue("@UserId", userId);

                SqlParameter IdOut = new SqlParameter("@Id", SqlDbType.Int);
                IdOut.Direction = ParameterDirection.Output;

                col.Add(IdOut);
            },
             returnParameters: delegate (SqlParameterCollection returnCollection)
             {
                 object oId = returnCollection["@Id"].Value;

                 int.TryParse(oId.ToString(), out id);
             });
            return id;

        }

        public void Update(JobUpdateRequest request, int userId)
        {
            string procName = "[dbo].[Jobs_UpdateBatch]";
            DataTable dt = new DataTable();
            dt.Columns.Add("Name", typeof(string));
            foreach (string skill in request.Skills)
            {


                DataRow dr = dt.NewRow();
                dr.SetField(0, skill);
                dt.Rows.Add(dr);
            }
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(request, col);
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@Id", request.Id);
                col.AddWithValue("@batchSkills", dt);
            },
            returnParameters: null);
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[Jobs_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);

            },
            returnParameters: null);
        }
        private static void AddCommonParams(JobAddRequest request, SqlParameterCollection col)
        {
            col.AddWithValue("@Title", request.Title);
            col.AddWithValue("@Description", request.Description);
            col.AddWithValue("@Summary", request.Summary);
            col.AddWithValue("@Pay", request.Pay);
            col.AddWithValue("@Slug", request.Slug);
            col.AddWithValue("@StatusId", request.StatusId);
            col.AddWithValue("@TechCompanyId", request.TechCompanyId);

        }
        private static Job MapSingleJob(IDataReader reader, ref int startingIndex)
        {

            Job job = new Job();
            job.PrimaryImage = new Image();

            job.Id = reader.GetSafeInt32(startingIndex++);
            job.Title = reader.GetSafeString(startingIndex++);
            job.Description = reader.GetSafeString(startingIndex++);
            job.Summary = reader.GetSafeString(startingIndex++);
            job.Pay = reader.GetSafeString(startingIndex++);
            job.Slug = reader.GetSafeString(startingIndex++);
            job.StatusId = reader.GetSafeInt32(startingIndex++);
            job.UserId = reader.GetSafeInt32(startingIndex++);
            job.PrimaryImage.Id = reader.GetSafeInt32(startingIndex++);
            job.PrimaryImage.Url = reader.GetSafeString(startingIndex++);
            job.PrimaryImage.TypeId = reader.GetSafeInt32(startingIndex++);
            job.Skills = reader.DeserializeObject<List<Skill>>(startingIndex++);
            job.TechCompanyName = reader.GetSafeString(startingIndex++);
            job.TechCompanyId = reader.GetSafeInt32(startingIndex++);
            job.DateModified = reader.GetSafeDateTime(startingIndex++);
            job.DateCreated = reader.GetSafeDateTime(startingIndex++);

            return job;
        }
    }
}
