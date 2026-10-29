import { useParams } from "react-router-dom";
import PlaceFormPage from "./PlaceFormPage";

function UpdateEntityPage() {
  const { id } = useParams();
  return <PlaceFormPage key={id} id={id} />;
}

export default UpdateEntityPage;
