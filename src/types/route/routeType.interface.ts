export interface IRouteData {
  country?: string;
  state?: string;
  routeId: number;
  routeName: string;
  routeDetails?: string;
  routeImage?: string;
  googleMapLink?: string;
  distance?: number;
  elevationGain?: number;
  elevationLoss?: number;
  surfaceType: string;
  difficultyLevel?: string;
  status?: string; 
  createdBy?:  number;
  routeCreatorProfilePicture?: string;
  createdByName?:string;
  sportsCategoryIdList?:string;
  sportsCategoryNameList?:string;
}

