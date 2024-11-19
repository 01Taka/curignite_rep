import { groupingByKey, objectArrayToDict } from "../../../functions/utils/objectUtils";
import { CategoryActivityStatus, ProblemSetActivityField, TaskData } from "../../../types/firebase/db/task/taskExpansionTypes";
import { validateNumber } from "../../../functions/utils/formUtils";
import { isNumberInRange, rangesToArray } from "../../../functions/utils/rangeUtils";
import { CategoryActivity } from "../../../types/firebase/db/task/taskSupplementTypes";
import { IndividualTaskRead, ProblemSetActivityRead, ProblemSetCategoryRead, ProblemSetRead } from "../../../types/firebase/db/task/taskStructure";
import { ProblemSetService } from "../app/user/subCollection/task/problemSetService";
import { ProblemSetActivityService } from "../app/user/subCollection/task/problemSetActivityService";
import { ProblemSetCategoryService } from "../app/user/subCollection/task/problemSetCategoryService";
import { IndividualTaskService } from "../app/user/subCollection/task/individualTaskService";

export class TaskManagementService {
  static individualTasksToTasksData(individualTasks: IndividualTaskRead[]): TaskData[] {
    return individualTasks.map(task => ({
      ...task,
      isIndividual: true,
      remainingEstimatedDuration: (1 - task.progress) * task.estimatedDuration,
    }));
  }

  static createTaskData(
    individualTasks: IndividualTaskRead[],
    problemSets: ProblemSetRead[],
    categoriesByParent: Record<string, ProblemSetCategoryRead[]>,
    activitiesByParent: Record<string, ProblemSetActivityRead[]>
  ): TaskData[] {
    const problemSetTasks = problemSets.flatMap(problemSet =>
      this.problemSetDataToTaskData(
        problemSet,
        categoriesByParent[problemSet.docId] || [],
        activitiesByParent[problemSet.docId] || []
      )
    );
  
    const individualTaskData = this.individualTasksToTasksData(individualTasks);
  
    return [...problemSetTasks, ...individualTaskData];
  }

  static async fetchAllTasks(
    userId: string,
    services: {
      individualTaskService: IndividualTaskService;
      problemSetService: ProblemSetService;
      activityService: ProblemSetActivityService;
      categoryService: ProblemSetCategoryService;
    }
  ) {
    try {
      // 個別タスクを取得
      const individualTasksPromise = services.individualTaskService.getAllTasks(userId);
  
      // 問題セットを取得
      const problemSetsPromise = services.problemSetService.getAllProblemSets(userId);
  
      // 問題セット取得後にカテゴリとアクティビティを取得
      const [individualTasks, problemSets] = await Promise.all([
        individualTasksPromise,
        problemSetsPromise,
      ]);
  
      const categoriesAndActivitiesPromises = problemSets.map(async (problemSet) => {
        const id = problemSet.docId;
        const [categories, activities] = await Promise.all([
          services.categoryService.getAllCategories(userId, id),
          services.activityService.getAllActivities(userId, id),
        ]);
        return { categories, activities };
      });
  
      const categoriesAndActivities = await Promise.all(categoriesAndActivitiesPromises);
  
      // カテゴリとアクティビティを統合
      const categories = categoriesAndActivities.flatMap((data) => data.categories);
      const activities = categoriesAndActivities.flatMap((data) => data.activities);
  
      return {
        individualTasks,
        problemSets,
        categories,
        activities,
      };
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw error; // 必要に応じてエラーを上位で処理
    }
  }

  static async fetchAllTasksAsFormatData(
    userId: string,
    services: {
      individualTaskService: IndividualTaskService;
      problemSetService: ProblemSetService;
      activityService: ProblemSetActivityService;
      categoryService: ProblemSetCategoryService;
    }
  ) {
    const data = await this.fetchAllTasks(
      userId,
      services
    )

    const formatData = this.formatDataForExport(
      data.individualTasks,
      data.problemSets,
      data.categories,
      data.activities
    )

    return { individualTasks: data.individualTasks, ...formatData}
  }
  
  static formatDataForExport(
    individualTasks: IndividualTaskRead[],
    problemSets: ProblemSetRead[],
    categories: ProblemSetCategoryRead[],
    activities: ProblemSetActivityRead[]
  ) {
    // データのグループ化
    const categoriesByParent = groupingByKey(categories, 'parentId');
    const activitiesByParent = groupingByKey(activities, 'parentId');
  
    // マッピングを生成
    const tasks = this.createTaskData(individualTasks, problemSets, categoriesByParent, activitiesByParent);
    const problemSetMap = objectArrayToDict(problemSets, 'docId');
    const categoryMap = objectArrayToDict(categories, 'docId');
    const activityMap = objectArrayToDict(activities, 'docId');
  
    // 構造データを生成
    const problemSetStructures = problemSets.map(problemSet => ({
      problemSetId: problemSet.docId,
      categories: categoriesByParent[problemSet.docId] || [],
      activities: activitiesByParent[problemSet.docId] || []
    }));
  
    return {
      tasks,
      problemSetMap,
      categoryMap,
      activityMap,
      problemSetStructures
    };
  }

  // static async getIndividualTasksAsTasksData(factory: ServiceFactory, userId: string): Promise<FetchAllPart> {
  //   const tasks = await factory.createIndividualTaskService().getAllTasks(userId);
  //   return { tasks: TaskManagementService.individualTasksToTasksData(tasks), problemSetData: null };
  // }

  // static async fetchAllData(factory: ServiceFactory, userId: string): Promise<FetchAllResults> {
  //   const problemSetService = factory.createProblemSetService();
  //   const activityService = factory.createProblemSetActivityService();
  //   const categoryService = factory.createProblemSetCategoryService();
  
  //   try {
  //     const fetchPromises: Promise<FetchAllPart>[] = [];

  //     // ProblemSetの取得
  //     const problemSets = await problemSetService.getAllProblemSets(userId);
      
  //     if (problemSets.length > 0) {
  //       // ActivitiesとCategoriesの取得
  //       const result: Promise<FetchAllPart>[] = problemSets.map(async (problemSet) => {
  //         const problemSetId = problemSet.docId;
  //         const activities = await activityService.getAllActivities(userId, problemSetId);
  //         const categories = await categoryService.getAllCategory(userId, problemSetId);

  //         if (categories.length === 0) {
  //           console.error('Categoriesが見つかりませんでした。userId, problemSetId: ', userId, problemSetId);
  //           return { tasks: [], problemSetData: null };
  //         }

  //         let tasks: TaskData[] = []
    
  //         if (activities.length > 0) {
  //           tasks = TaskManagementService.problemSetDataToTaskData(problemSet, categories, activities);
  //         }
          
  //         const expansionProblemSetData: ExpansionProblemSetData = {
  //           ...problemSet,
  //           averageEstimatedDuration: categories.reduce((total, category) => total + category.timePerProblem, 0) / categories.length,
  //           totalProblemNumber: categories.reduce((total, category) => total + (category.totalProblemNumber ?? sumRanges(category.completedProblemIdsRange)), 0),
  //           completedProblemNumber: categories.reduce((total, category) => total + sumRanges(category.completedProblemIdsRange), 0),
  //         }

  //         const problemSetWithTaskData: FullProblemSetData = {
  //           problemSet: expansionProblemSetData,
  //           activities: tasks,
  //           categories
  //         }
    
  //         return { tasks, problemSetData: problemSetWithTaskData } as FetchAllPart;
  //       });
  //       fetchPromises.push(...result);
  //     }

  //     // 個別タスクの取得
  //     const individualTasks = TaskManagementService.getIndividualTasksAsTasksData(factory, userId);
  //     fetchPromises.push(individualTasks);
  
  //     // Promise.allを使ってすべての処理が完了するのを待機
  //     const results = await Promise.all(fetchPromises);
  //     const flattedResults = results.flat();
  //     const fetchAllResults: FetchAllResults = {
  //       tasks: flattedResults.flatMap(res => res.tasks),
  //       problemSetData: flattedResults.map(res => res.problemSetData).filter(data => data !== null) as FullProblemSetData[]
  //     }
  //     return fetchAllResults;
  //   } catch (error) {
  //     console.error('データ取得中にエラーが発生しました。userId: ', userId, error);
  //     return { tasks: [], problemSetData: [] };
  //   }
  // }

  static problemSetDataToTaskData(
    problemSet: ProblemSetRead,
    categories: ProblemSetCategoryRead[],
    activities: ProblemSetActivityRead[]
  ): TaskData[] {
    const categoryMap = objectArrayToDict(categories, 'docId');

    const createBaseData = (activity: ProblemSetActivityRead) => ({
      ...activity,
      title: problemSet.name,
      taskNote: '',
    });

    const processCategoryActivities = (activity: ProblemSetActivityRead) => {
      return activity.categoryActivities.reduce(
        (acc, act) => TaskManagementService.processCategoryActivity(acc, act, categoryMap),
        {
          totalProblemCount: 0,
          totalRemainingProblemNumber: 0,
          totalEstimatedDuration: 0,
          completedCount: 0,
          remainingEstimatedDuration: 0,
          activityStatus: [] as CategoryActivityStatus[],
        }
      );
    };

    return activities.map(activity => {
      if (activity.categoryActivities.length === 0) {
        return null; 
      }
      const baseData = createBaseData(activity);
      const {
        totalProblemCount,
        totalRemainingProblemNumber,
        totalEstimatedDuration,
        completedCount,
        remainingEstimatedDuration,
        activityStatus,
      } = processCategoryActivities(activity);

      const progress = validateNumber(completedCount / totalProblemCount);

      const activityField: ProblemSetActivityField = {
        problemSet,
        categoryMap,
        totalProblemCount,
        totalRemainingProblemNumber,
        activityManagementMethod: problemSet.activityManagementMethod,
        completionRate: `${completedCount}/${totalProblemCount}`,
        activityStatus,
      };

      return {
        ...baseData,
        estimatedDuration: totalEstimatedDuration,
        remainingEstimatedDuration,
        progress,
        isIndividual: false,
        completed: progress === 1,
        problemSetActivityField: activityField,
      } as TaskData;
    }).filter(data => data !== null) as TaskData[];
  }

  private static processCategoryActivity(
    acc: {
      totalProblemCount: number;
      totalRemainingProblemNumber: number;
      totalEstimatedDuration: number;
      completedCount: number;
      remainingEstimatedDuration: number;
      activityStatus: CategoryActivityStatus[];
    },
    act: CategoryActivity,
    categoryMap: { [docId: string]: ProblemSetCategoryRead }
  ) {
    const category = categoryMap[act.categoryId];
    const problemIds = rangesToArray(act.problemIdsRange);
    const problemCount = problemIds.length;

    if (!category) {
      acc.totalProblemCount += problemCount;
      return acc;
    }

    const { completedIds, remainingIds } = problemIds.reduce(
      (status, id) => {
        if (isNumberInRange(category.completedProblemIdsRange, id, true)) {
          status.completedIds.push(id);
        } else {
          status.remainingIds.push(id);
        }
        return status;
      },
      { completedIds: [] as number[], remainingIds: [] as number[] }
    );

    const completedProblems = completedIds.length;
    const timePerProblem = category.timePerProblem ?? 0;

    acc.totalProblemCount += problemCount;
    acc.totalRemainingProblemNumber += remainingIds.length;
    acc.totalEstimatedDuration += problemCount * timePerProblem;
    acc.completedCount += completedProblems;
    acc.remainingEstimatedDuration += remainingIds.length * timePerProblem;

    acc.activityStatus.push({
      categoryId: category.docId,
      categoryName: category.name,
      problemIdsRange: act.problemIdsRange,
      completedProblemIds: completedIds,
      remainingProblemIds: remainingIds,
    });

    return acc;
  }
}
