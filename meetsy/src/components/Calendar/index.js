import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { withAuthorization } from '../Session';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

moment.locale("en-GB", {
    week: {
        dow: 1,
    },
});

const myEventsList = []

const localizer = momentLocalizer(moment);

const MyCalendar = props => (
    <div>
        <h1>Calendar</h1>
        <Calendar
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            defaultDate={moment().toDate()}
        />
    </div>
)

const condition = authUser => !!authUser;
export default withAuthorization(condition)(MyCalendar);