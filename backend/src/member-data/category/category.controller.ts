import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { AuthGuard } from "@nestjs/passport";
import { Member } from "src/auth/get-member-decorator";
import { MemberEntity } from "src/auth/member.entity";
import { CategoryEntiy } from "./entity/category.entity";
import { ApiExceptionResponse } from "src/utils/exception-response.decorater";
import { AddCategoryDto } from "./dto/add-category.dto";

@ApiTags('Member Data -category- Controller')
@Controller('/member-data')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
  ){};
  
  @ApiOperation({ summary: 'member id로 카테고리 리스트를 가져옵니다.' })
  @Get('/category/:memberId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  async loadCategories(
    @Member() member: MemberEntity
    ):Promise<CategoryEntiy[]>{
      return await this.categoryService.loadCategories(member.memberId);
   };

   @ApiOperation({ summary: '카테고리를 등록합니다.' })
   @Post('/add-category')
   @UseGuards(AuthGuard())
   @ApiBearerAuth('access-token')
   @ApiExceptionResponse(
     404,
     '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
     '[ERROR] 해당 member id를 찾을 수 없습니다.',
   )
   @ApiExceptionResponse(
     500,
     '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
     `[ERROR] 카테고리를 추가하는 중 예상치 못한 에러가 발생했습니다.`,
   )
   async addCategory(
     @Body() addCategoryDto: AddCategoryDto,
     @Member() member: MemberEntity
     ):Promise<void>{
       await this.categoryService.addCategory(addCategoryDto.categoryName, member.memberId);
     };
}