import s from "./scan.module.css";
import Sidebar from "../sidebar.jsx";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
//import Dig_History from "../diagnostic-history/Dig_History.jsx";
import axios from "axios";
import { shareReducer } from "../../../redux-stuff/reducer.js";
import { useNavigate } from "react-router-dom";
import { updateData } from "../../../redux-stuff/form_action.js";
import { connect } from "react-redux";
library.add(faCirclePlus);

function Scan_page({ Hname }) {
  const navigate = useNavigate();

  const [id, setid] = useState("");
  const [time, settime] = useState("");
  const [data, setdata] = useState("");
  const [loading, setLoading] = useState(false);

  const submitThis = async () => {
    const info = { hid: id };

    try {
      setLoading(true);
      const response = await axios.get(
        "https://ehs-q3hx.onrender.com/api/fetchPatientPrescription/" + id
      );
      console.log(response.data);
      setdata(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    //        console.log( id, "got id, running route")
    submitThis();
    setid("");
  }
  if (id && data) {
    let currentTime = Date.now(); // Current timestamp in milliseconds
    let difference = currentTime - time; // Difference in milliseconds

    // Convert difference to minutes
    let differenceInMinutes = difference / (1000 * 60); // Convert milliseconds to minutes

    console.log("Difference in minutes:", differenceInMinutes);

    // Check if the difference is less than 10 minutes
    if (differenceInMinutes < 10) {
      navigate("/scaned_id", { state: { id: { id }, data: { data } } });
      console.log("The difference is less than 10 minutes");
      return true;
    } else {
      console.log("The difference is greater than or equal to 10 minutes");
      window.alert("qr expired");
      return false;
    }
  }

  return (
    <>
      <div className={s.whole_screen}>
        <div className={s.upar}>
          <div className={s.title}> {Hname} </div>
          <i>
            {" "}
            <FontAwesomeIcon
              icon={["fa", "circle-plus"]}
              size={"3x"}
              style={{ color: "#E55771" }}
            />{" "}
          </i>
        </div>
        <div className={s.sub_upar}>
          <div className={s.title}> Scan ID </div>
        </div>
        <div className={s.side}>
          <Sidebar />
        </div>

        <div className={s.main_maal}>
          <QrScanner
            containerStyle={{
              width: "30%",
              paddingTop: "30%",
              margin: "0 0 0 20rem",
            }}
            //                    videoStyle={{width:"50%", left:"10rem"}}
            //                    scanDelay={1000}
            onDecode={(result) => {
              console.log(result);
              let dataBeforeDash = result.split("-")[0];
              console.log(dataBeforeDash);
              setid(dataBeforeDash);
              let dataAfterDash = result.split("-")[1]; // Extract the part after '-'
              console.log(dataAfterDash);
              settime(dataAfterDash);
            }}
            onError={(error) => console.log(error?.message)}
          />
          {/*{loading ? (*/}
          {/*    <CircularProgress />*/}
          {/*    ) : (*/}
          {/*        <Dig_History id={id} data={data}/>*/}
          {/*        )}*/}
        </div>
        <div className={s.bottom}>Place the QR Code between the box</div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    hid: state.data.hid,
    id: state.data.id,
    Hname: state.data.Hname,
  };
};

export default connect(mapStateToProps, { updateData })(Scan_page);
