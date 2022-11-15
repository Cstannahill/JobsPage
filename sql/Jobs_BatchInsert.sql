ALTER proc [dbo].[Jobs_BatchInsert]
					@batchSkills dbo.SkillsTable READONLY
					,@Title nvarchar(120)
					,@Description nvarchar(255)
					,@Summary nvarchar(255)
					,@Pay nvarchar(120)
					,@Slug nvarchar(100)
					,@StatusId int
					,@TechCompanyId int
					,@UserId int
					,@Id int OUTPUT


as

/*

	Select *
	From Skills
	Select *
	From dbo.Jobs

	Declare @newSkills dbo.SkillsTable

		Declare	@Title nvarchar(120) = 'Software Engineer'
				,@Description nvarchar(255) = 'Description of software engineer'
				,@Summary nvarchar(255) = 'Summary of software engineer'
				,@Pay nvarchar(120) = '70,000'
				,@Slug nvarchar(100) = 'yep'
				,@StatusId int = 1
				,@TechCompanyId int = 3
				,@UserId int = 1
				,@Id int 

	Insert into @newSkills(Name)
			Values('PHP')
	Insert into @newSkills(Name)
			Values('Ruby')
	Insert into @newSkills(Name)
			Values('Swift')
	Insert into @newSkills(Name)
			Values('Wordpress')

			

	Execute Jobs_BatchInsert
						@newSkills
						,@Title
						,@Description
						,@Summary
						,@Pay
						,@Slug
						,@StatusId
						,@TechCompanyId
						,@UserId
						,@Id OUTPUT
	Select *
	From dbo.Jobs
	Select *
	From Skills

	Where Id = @Id




	Execute Jobs_SelectAll
*/



BEGIN

		Declare @SkillId int


	INSERT INTO dbo.Skills
				([Name])
					

	SELECT bs.Name
			
	From @batchSkills as bs
	Where Not Exists ( Select 1
						From dbo.Skills as s
						where s.Name = bs.Name )



		INSERT INTO [dbo].[Jobs]
				   ([Title]
				   ,[Description]
				   ,[Summary]
				   ,[Pay]
				   ,[Slug]
				   ,[StatusId]
				   ,TechCompanyId
				   ,UserId)

			 VALUES
				   (@Title
				   ,@Description
				   ,@Summary
				   ,@Pay
				   ,@Slug
				   ,@StatusId
				   ,@TechCompanyId
				   ,@UserId)
				

			SET @Id = SCOPE_IDENTITY()

			INSERT INTO dbo.Job_Skills_Bridge
						([SkillId]
						,[JobId])

				Select	s.Id
						,@Id

				From dbo.Skills as s WHERE EXISTS (Select 1
													From @batchSkills as bs
													WHERE s.Name = bs.Name) 
				    
END