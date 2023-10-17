import { Injectable } from '@nestjs/common';
import { CreateGraphqlInput, PostGraphqlInput } from './dto/create-graphql.input';
import { UpdateGraphqlInput } from './dto/update-graphql.input';
import { Product } from '../graphql';
import { FilteringInput, SortingInput, PaginationInput } from './dto/create-graphql.input';
import { Post, PostDocument } from './entities/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GraphqlService {

  productData: Product[];
  constructor(@InjectModel('post')
  public PostModel: Model<PostDocument>) { 
    this.productData = [
      {
        "title": "Redmi",
        "description": "Redmi Mobile is making best display.",
        "price": 25000 
      },
      {
        "title": "Samsung",
        "description": "Samsung Mobile is making best display.",
        "price": 25000
      },
      {
        "title": "Oneplus",
        "description": "Oneplus Mobile is making best display.",
        "price": 25000
      }
    ]
  }

  /**
   * Purpose: create product
   * @param createGraphqlInput 
   * @returns 
   */
  create(createGraphqlInput: CreateGraphqlInput) {
    this.productData.push(createGraphqlInput);
    return "Product created Successfully";
  }

  /**
   * Purpose: Find all product
   * @returns 
   */
  findAll() {
    return this.productData;
  }

  /**
   * Purpose: Apply filter on product
   * @param filter 
   * @param sorting 
   * @param pagination 
   * @returns 
   */
  findQuery(filter:FilteringInput, sorting:SortingInput, pagination:PaginationInput) {

    let skip = pagination.skip;
    let filterData = [];
    this.productData.find((res) => {
      if(Object.keys(res).includes(filter.field) && res[filter.field]==filter.keyword){
        filterData.push(res);
      }
    });

    let sortedData = filterData.sort((a, b) => {
      if (a.sorting.field > b.sorting.field) return -1;
      if (a.title < b.title) return 1;
      return 0;
    });

    let queryData = sortedData.slice(pagination.skip, skip+pagination.take);
    return queryData;
  }

  /**
   * Purpose: Find product by price
   * @param price 
   * @returns 
   */
  findOne(price: number) {
    let data=[];
    this.productData.find((res) => {
      if(res.price==price){
        data.push(res);
      }
    });
    return data;
  }

  /**
   * Purpose: update product by ID
   * @param id 
   * @param createGraphqlInput 
   * @returns 
   */
  update(id: number, createGraphqlInput: CreateGraphqlInput) {

    return "Product Updated Successfully";
  }

  /**
   * Purpose: remove product by ID
   * @param id 
   * @returns 
   */
  remove(id: number) {
    let index = this.productData.findIndex(res => {res.price==id});
    this.productData.splice(index,1);
    return "Product is deleted Successfully";

  }

  // create Post Operation
  /**
   * Purpose: create GraphQL entries
   * @param postGraphqlInput 
   * @returns 
   */
  async creatPost(postGraphqlInput: PostGraphqlInput) {
    let Post = await this.PostModel.create(postGraphqlInput);
    return "Post Created Successfully";
  }

  /**
   * Puspose: Update post by ID
   * @param id 
   * @param postGraphqlInput 
   * @returns 
   */
  async updatePost(id:string,postGraphqlInput: PostGraphqlInput){
    let Post = await this.PostModel.findByIdAndUpdate({_id:id},postGraphqlInput);
    return "Post Updated Successfully";
  }

  /**
   * Purpose: Delete post by ID
   * @param id 
   * @returns 
   */
  async deletePost(id:string){
    let Post = await this.PostModel.findByIdAndDelete({_id:id});
    return "Post deleted Successfully";
  }
  /**
   * Purpose: Apply filter query
   * @param filter 
   * @param sorting 
   * @param pagination 
   * @returns 
   */
  async filterPost(filter:FilteringInput,sorting: SortingInput,pagination: PaginationInput){
      const filterName = filter['field'];
      const filterValue = filter['value'];
      const paginationSkip = pagination.skip;
      const paginationTake = pagination.take;
    let data = await this.PostModel.find({filterName:filterValue}).skip(paginationSkip).limit(paginationTake);
    return data;
  }

  /**
   * Purpose: Find All post data
   * @returns 
   */
  async findAllPost(){
    const data = await this.PostModel.find();
    return data;
  }
}