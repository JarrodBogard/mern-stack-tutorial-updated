import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import GoalForm from "../components/GoalForm";
import GoalItem from "../components/GoalItem";
import Spinner from "../components/Spinner";
import { getGoals, reset } from "../features/goals/goalSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { goals, isLoading, isError, message } = useSelector(
    (state) => state.goals
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
      // return () => {
      //   dispatch(reset());
      // };
    }

    if (user) {
      dispatch(getGoals());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Goals Dashboard</p>
      </section>

      <GoalForm />

      <section className="content">
        {goals.length > 0 ? (
          <div className="goals">
            {goals.map((goal) => (
              <GoalItem key={goal._id} goal={goal} />
            ))}
          </div>
        ) : (
          <h3>Create A Goal</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;

// the second useEffect isn't needed. the reason the one useEffect doesn't work is because of the dispatch(getGoals()) being executed causing the payload to get rejected and isError being set to true which causes constant re-renders. Instead check if the user is actually logged in before calling getGoals()

// This will work:
// useEffect(() => {
// if(!user){
//   navigate("/login")
// }
// else{
//  dispatch(getGoals())
// }

// if(isError){
// console.log("Error")
// }

// return () => {
// dispatch(reset())
// }
// }, [user, message, isError, dispatch, navigate])
