/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
// 创作者 接口要求
const creator ='小申';
// 封装渲染函数
function getBooksList(){
    axios({
        url:'http://hmajax.itheima.net/api/books',
        method:'GET',
        params:{
            creator:creator,
        }
    
    }).then(res=>{
        console.log(res.data.data);
        const arrData = res.data.data;
       const  htmlStr = arrData.map((item,index)=>{
        const {author,bookname,publisher,id} = item;
        // console.log(item);
        // map有返回值return
         // 之所以data自定义属性绑定在"父级", 删除 和 编辑都需要用到图书id
        return `<tr>
            <td>${index + 1}</td>
            <td>${bookname}</td>
            <td>${author}</td>
            <td>${publisher}</td>
            <td data-id='${id}'>
              <span class="del" >删除</span>
              <span class="edit">编辑</span>
            </td>
          </tr>
            `
        }).join('');
        // console.log(htmlStr);
        document.querySelector('.list').innerHTML = htmlStr
    })
}
getBooksList();
// 目标2:新增图书
// js控制保存按钮的关闭
const addModalDom = document.querySelector('.add-modal');
const addModal = new bootstrap.Modal(addModalDom);

document.querySelector('.add-btn').addEventListener('click',()=>{
    const getFormvalue = document.querySelector('.add-form');
    const formValue = serialize(getFormvalue,{hash:true,empty:true});
    console.log(formValue);
    // const {author,bookname,publisher} = formValue;

    // 提交新增数据
    axios({
        url:'http://hmajax.itheima.net/api/books',
        method:'POST',
        data:{
            // 用展开数组方法
            ...formValue,

            // author:author,
            // bookname:bookname,
            // publisher:publisher,
            creator:creator
        }
    }).then(res=>{
        console.log(res);
      
        // 提交到服务器之后 自动再次获取新数据渲染
        getBooksList();
        // 清空增加的表单值
        getFormvalue.reset();
    //   收起
        addModal.hide();
        setTimeout(()=>{
            alert(res.data.message);
        },500)
    })
   
})

// 目标3：删除图书
document.querySelector('.list').addEventListener('click',e=>{
    console.log(e.target);
    if(e.target.classList.contains('del')){
        // console.log(1);
    const bookId = e.target.parentNode.dataset.id;
    console.log(bookId);
    axios({
        url:`http://hmajax.itheima.net/api/books/${bookId}`,
        method:'DELETE'
    }).then(res =>{
        console.log(res + '1');
       
        // 设置定时器 1秒后显示成功信息
        getBooksList();
        setTimeout(()=>{
            alert(res.data.message);
        },1000)
        
    })
    }
})

// 目标4：编辑图书
const editModalDom = document.querySelector('.edit-modal');
const editModal = new bootstrap.Modal(editModalDom);
// 因为编辑是动态生成的 要用事件委托
document.querySelector('.list').addEventListener('click',(e)=>{

    if(e.target.classList.contains('edit')){
        // console.log('辑');
        const bookId = e.target.parentNode.dataset.id;
        axios({
            url:`http://hmajax.itheima.net/api/books/${bookId}`,
            method:'GET'
        }).then(res=>{
          const arrData = res.data.data;
        //   点击修改 回显图书信息
          const keys = Object.keys(arrData);
        //   console.log(keys);
          keys.forEach(key=>{
            document.querySelector(`.edit-form .${key}`).value =arrData[key];
          })
         
        })
        editModal.show();

    }
})
document.querySelector('.edit-btn').addEventListener('click', ()=>{
   const editForm =  document.querySelector('.edit-form');
   const editArr = serialize(editForm,{hash:true , empty:true});
   const {id,author,bookname,publisher} = editArr;
//    console.log(editArr);
    axios({
        // 图书id 隐藏
        url:`http://hmajax.itheima.net/api/books/${id}`,
        method:'PUT',
        data:{
            bookname:bookname,
            author:author,
            publisher:publisher,
            creator:creator
        }
    }).then(res =>{
        // console.log(res);
        getBooksList();
        editModal.hide();

        setTimeout(()=>{
            alert(res.data.message);
        },1000)
    })
    
})