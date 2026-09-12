import "./list.scss";
import Card from "../card/Card";

function List({ posts, currentUserId, onDelete }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card
          key={item.id}
          item={item}
          currentUserId={currentUserId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default List;

// import './list.scss'
// import Card from"../card/Card"

// function List({posts}){
//   return (
//     <div className='list'>
//       {posts.map(item=>(
//         <Card key={item.id} item={item}/>
//       ))}
//     </div>
//   )
// }

// export default List
