namespace Web.Api.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobApiController : ControllerBase
    {
        private IJobService _service = null;
        private IAuthenticationService<int> _authService = null;

        public JobApiController(IJobService service, IAuthenticationService<int> authService)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Job>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Job job = _service.Get(id);
                if (job == null)
                {
                    code = 404;
                    response = new ErrorResponse("Friend not found.");
                }
                else
                {
                    response = new ItemResponse<Job> { Item = job };
                }
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet]
        public ActionResult<ItemsResponse<Job>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Job> list = _service.GetAll();

                if(list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Jobs not found.");
                }
                else
                {
                    response = new ItemsResponse<Job> { Items = list };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);

            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Job>>> Pagination(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Job> paged = _service.Pagination(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    ItemResponse<Paged<Job>> result = new ItemResponse<Paged<Job>>();
                    result.Item = paged;
                    code = 200;
                    return StatusCode(code, result);

                }
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Job>>> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Job> paged = _service.SearchPaginated(pageIndex, pageSize, query);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    ItemResponse<Paged<Job>> result = new ItemResponse<Paged<Job>>();
                    result.Item = paged;
                    code = 200;
                    return StatusCode(code, result);

                }
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(JobAddRequest request)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 201;
            BaseResponse response = null;

            try
            {
                int id = _service.Add(request, userId);

                code = 201;
                response = new ItemResponse<int> { Item = id };
            }
            catch (SqlException sqlEx)
            {
                code = 500;

                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;

                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;

                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(JobUpdateRequest request)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(request, userId);
                response = new SuccessResponse();
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Exception Error: {ex.Message}");
            }

            return StatusCode(code, response);
        }
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }
    }
}

