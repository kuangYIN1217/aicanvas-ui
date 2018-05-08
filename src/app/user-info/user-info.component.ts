import { Component, OnInit } from '@angular/core';
import {calc_height} from "../common/ts/calc_height";
declare var $:any;
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent{
  userAuthority:any={
    "basRole": {
      "id": 1,
      "role_name": "系统角色",
      "createTime": null,
      "creator": null,
      "isInUse": "1"
    },
    "authorityTreeList": [
      {
        "basAuthority": {
          "id": 1,
          "authorityName": "信息总览",
          "authorityType": "1",
          "isInUse": "1",
          "createTime": null,
          "creator": null,
          "num": null
        },
        "childAuthorityTreeDtos": null,
        "hasAuthority": true
      },
      {
        "basAuthority": {
          "id": 2,
          "authorityName": "场景管理",
          "authorityType": "1",
          "isInUse": "1",
          "createTime": null,
          "creator": null,
          "num": null
        },
        "childAuthorityTreeDtos": [
          {
            "basAuthority": {
              "id": 3,
              "authorityName": "公共场景",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": true
          },
          {
            "basAuthority": {
              "id": 4,
              "authorityName": "我的场景",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": true
          }
        ],
        "hasAuthority": true
      },
      {
        "basAuthority": {
          "id": 5,
          "authorityName": "数据集管理",
          "authorityType": "1",
          "isInUse": "1",
          "createTime": null,
          "creator": null,
          "num": null
        },
        "childAuthorityTreeDtos": [
          {
            "basAuthority": {
              "id": 6,
              "authorityName": "公共数据集",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": true
          },
          {
            "basAuthority": {
              "id": 7,
              "authorityName": "我的数据集",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          },
          {
            "basAuthority": {
              "id": 8,
              "authorityName": "数据标注（图像）",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          },
          {
            "basAuthority": {
              "id": 9,
              "authorityName": "数据备份",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          }
        ],
        "hasAuthority": true
      },
      {
        "basAuthority": {
          "id": 10,
          "authorityName": "模型发布管理",
          "authorityType": "1",
          "isInUse": "1",
          "createTime": null,
          "creator": null,
          "num": null
        },
        "childAuthorityTreeDtos": null,
        "hasAuthority": null
      },
      {
        "basAuthority": {
          "id": 11,
          "authorityName": "训练任务管理",
          "authorityType": "1",
          "isInUse": "1",
          "createTime": null,
          "creator": null,
          "num": null
        },
        "childAuthorityTreeDtos": [
          {
            "basAuthority": {
              "id": 12,
              "authorityName": "创建训练任务",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          },
          {
            "basAuthority": {
              "id": 13,
              "authorityName": "执行训练任务",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          },
          {
            "basAuthority": {
              "id": 14,
              "authorityName": "查看算法链",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          },
          {
            "basAuthority": {
              "id": 15,
              "authorityName": "编辑算法链",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          },
          {
            "basAuthority": {
              "id": 16,
              "authorityName": "推演",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          },
          {
            "basAuthority": {
              "id": 17,
              "authorityName": "模型发布",
              "authorityType": "2",
              "isInUse": "1",
              "createTime": null,
              "creator": null,
              "num": null
            },
            "childAuthorityTreeDtos": null,
            "hasAuthority": null
          }
        ],
        "hasAuthority": null
      },
      {
        "basAuthority": {
          "id": 18,
          "authorityName": "算法组件库",
          "authorityType": "1",
          "isInUse": "1",
          "createTime": null,
          "creator": null,
          "num": null
        },
        "childAuthorityTreeDtos": null,
        "hasAuthority": null
      }
    ]
  };
  zNodes:any[]=[];
  constructor() {

  }
  showIconForTree(treeId, treeNode) {
    return !treeNode;
  }
  ngOnInit() {
    var zNodes=[];
    let data = this.userAuthority.authorityTreeList;
    for(let i=0;i<data.length;i++){
      let obj:any={};
      obj.name = data[i].basAuthority.authorityName;
      if(data[i].childAuthorityTreeDtos!=null){
        obj.open = true;
        obj.children=[];
        for(let j=0;j<data[i].childAuthorityTreeDtos.length;j++){
          let child:any={};
          child.name = data[i].childAuthorityTreeDtos[j].basAuthority.authorityName;
          obj.children.push(child);
        }
      }else{
        obj.isParent = true;
      }
      zNodes.push(obj);
    }
    console.log(zNodes);
    var setting = {
      view: {
        showIcon: this.showIconForTree
      },
    };

/*    var zNodes =[
      { name:"父节点1 - 展开", open:true,
        children: [
          { name:"父节点11 - 折叠",
            children: [
              { name:"叶子节点111"},
              { name:"叶子节点112"},
              { name:"叶子节点113"},
              { name:"叶子节点114"}
            ]},
          { name:"父节点12 - 折叠",
            children: [
              { name:"叶子节点121"},
              { name:"叶子节点122"},
              { name:"叶子节点123"},
              { name:"叶子节点124"}
            ]},
          { name:"父节点13 - 没有子节点", isParent:true}
        ]},
      { name:"父节点2 - 折叠",
        children: [
          { name:"父节点21 - 展开", open:true,
            children: [
              { name:"叶子节点211"},
              { name:"叶子节点212"},
              { name:"叶子节点213"},
              { name:"叶子节点214"}
            ]},
          { name:"父节点11 - 折叠",
            children: [
              { name:"叶子节点111"},
              { name:"叶子节点112"},
              { name:"叶子节点113"},
              { name:"叶子节点114"}
            ]},
          { name:"父节点22 - 折叠",
            children: [
              { name:"叶子节点221"},
              { name:"叶子节点222"},
              { name:"叶子节点223"},
              { name:"叶子节点224"}
            ]},
          { name:"父节点23 - 折叠",
            children: [
              { name:"叶子节点231"},
              { name:"叶子节点232"},
              { name:"叶子节点233"},
              { name:"叶子节点234"}
            ]}
        ]},
      { name:"父节点3 - 没有子节点", isParent:true}
    ];*/
    $(document).ready(function(){
      $.fn.zTree.init($("#userTree"), setting, zNodes);
    });

    calc_height(document.getElementsByClassName('userContent')[0]);
  }

}
