export const getArrowDirection = (leftDrivingState, rightDrivingState) => {

    if (leftDrivingState === 'D') {

        if (rightDrivingState === 'D') {
            return 'up';
        }

        else if (rightDrivingState === 'N') {
            return 'right';
        }

        else if (rightDrivingState === 'R') {
            return 'doubleRight'
        }

    }

    else if (leftDrivingState === 'N') {

        if (rightDrivingState === 'D') {
            return 'left';
        }

        else if (rightDrivingState === 'N') {
            return 'defaultImage';
        }

        else if (rightDrivingState === 'R') {
            return 'right';
        }

    }

    else if (leftDrivingState === 'R') {

        if (rightDrivingState === 'D') {
            return 'doubleLeft';
        }

        else if (rightDrivingState === 'N') {
            return 'left';
        }

        else if (rightDrivingState === 'R') {
            return 'down';
        }

    }

    return 'defaultImage';

};



