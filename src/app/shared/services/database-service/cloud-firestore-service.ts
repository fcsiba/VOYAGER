import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { VehicleType } from '../../enums/enums';

@Injectable()
export class CloudFirestoreService {
  private db: firebase.firestore.Firestore = firebase.firestore();
  constructor() {}

  async get(
    documentName: string,
    collectionName: string,
    parentDocumentName?: string,
    parentCollectionName?: string
  ) {
      if (parentCollectionName) {
        return await this.db
          .collection(parentCollectionName)
          .doc(parentDocumentName)
          .collection(collectionName)
          .doc(documentName.trim())
          .get();
      } else {
        return await this.db.collection(collectionName).doc(documentName.trim()).get();
      }
  }

  async set(
    object : any,
    documentName: string,
    collectionName: string,
    parentDocumentName?: string,
    parentCollectionName?: string
  ) {
    if (parentCollectionName) {
        return await this.db
          .collection(parentCollectionName)
          .doc(parentDocumentName)
          .collection(collectionName)
          .doc(documentName.trim())
          .set(this.convertToObject(object));
      } else {
        return await this.db.collection(collectionName).doc(documentName.trim()).set(this.convertToObject(object));
      }
  }

  async update(
    object : any,
    documentName: string,
    collectionName: string,
    parentDocumentName?: string,
    parentCollectionName?: string
  ) {
    if (parentCollectionName) {
        return await this.db
          .collection(parentCollectionName)
          .doc(parentDocumentName)
          .collection(collectionName)
          .doc(documentName.trim())
          .update(this.convertToObject(object));
      } else {
        return await this.db.collection(collectionName).doc(documentName.trim()).set(this.convertToObject(object));
      }
  }

  async delete(
    documentName: string,
    collectionName: string,
    parentDocumentName?: string,
    parentCollectionName?: string
  ) {
    if (parentCollectionName) {
        return await this.db
          .collection(parentCollectionName)
          .doc(parentDocumentName)
          .collection(collectionName)
          .doc(documentName.trim())
          .delete();
      } else {
        return await this.db.collection(collectionName).doc(documentName.trim()).delete();
      }
  }

  async getAll(
    whereSrc:string,
    whereTgt:any,
    orderByTgt:string,
    orderBySort:firebase.firestore.OrderByDirection,
    collectionName: string,
    parentDocumentName?: string,
    parentCollectionName?: string
  ) {
    let data = await this.db.collection(collectionName).where(whereSrc,"==",whereTgt).orderBy(orderByTgt,orderBySort).get();
    let docs = [];
    data.forEach((val)=>{
      docs.push(val.data());
    })
    return docs;
  }

  async getAllServicesForTraveller(
    orderByTgt:string,
    orderBySort:firebase.firestore.OrderByDirection,
    collectionName: string,
    parentDocumentName?: string,
    parentCollectionName?: string
  ) {
    let data = await this.db.collection(collectionName).orderBy(orderByTgt,orderBySort).get();
    let docs = [];
    data.forEach((val)=>{
      docs.push(val.data());
    })
    return docs;
  }

  async getAllTraveller(
    destination : string,
    scheduleDate : string,
    source : string,
    orderByTgt:string,
    orderBySort:firebase.firestore.OrderByDirection,
    collectionName: string
  ) {
    let data = await this.db.collection(collectionName).where("destination","==",destination).where("source","==",source).where("scheduleDate","==",scheduleDate).orderBy(orderByTgt,orderBySort).get();
    let docs = [];
    data.forEach((val)=>{
      docs.push(val.data());
    })
    return docs;
  }

  async getAllAdmin(
    orderByTgt:string,
    orderBySort:firebase.firestore.OrderByDirection,
    collectionName: string,
    parentDocumentName?: string,
    parentCollectionName?: string
  ) {
    let data = await this.db.collection(collectionName).orderBy(orderByTgt,orderBySort).get();
    let docs = [];
    data.forEach((val)=>{
      docs.push(val.data());
    })
    return docs;
  }

  async snapshot(documentName: string,collectionName: string,parentDocumentName?: string,parentCollectionName?: string):Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
    if(parentCollectionName){
      return this.db.collection(parentCollectionName).doc(parentDocumentName).collection(collectionName).doc(documentName.trim());
    }else{
      return this.db.collection(collectionName).doc(documentName.trim());
    }
    // .onSnapshot((snapshot : firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>)=>{});
  }

  convertToObject(entity: any): any {
    let object: any = {};

    let keys = Object.keys(entity);
    if (keys[0] == "0") {
      object = entity;
    } else {
      for (let key of keys) {
        if (entity[key]) {
          if (entity[key].constructor === Array) {
            object[key] = [];
            for (let item of entity[key]) {
              object[key].push(this.convertToObject(item));
            }
          } else if (typeof entity[key] === "object") {
            object[key] = this.convertToObject(entity[key]);
          } else {
            object[key] = entity[key];
          }
        } else {
          object[key] = entity[key];
        }
      }
    }
    return object;
  }

}
