import React from "react";
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {GameType, MAX_MISTAKE_COUNT} from '../../const';
import {connect} from "react-redux";
import {ActionCreator} from "../../store/action";
import ArtistQuestionScreen from '../artist-question-screen/artist-question-screen';
import GenreQuestionScreen from '../genre-question-screen/genre-question-screen';
import withAudioPlayer from "../../hocs/with-audio-player/with-audio-player";
import withUserAnswer from "../../hocs/with-user-answer/with-user-answer";
import Mistakes from "../mistakes/mistakes";
import artistQuestionProp from "../artist-question-screen/artist-question.prop";
import genreQuestionProp from "../genre-question-screen/genre-question.prop";


const GenreQuestionScreenWrapped = withAudioPlayer(withUserAnswer(GenreQuestionScreen));
const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);

const GameScreen = ({questions, step, onUserAnswer, mistakes}) => {

  const question = questions[step];

  if (mistakes >= MAX_MISTAKE_COUNT) {
    return (
      <Redirect to="/lose" />
    );
  }

  if (step >= questions.length || !question) {

    return (
      <Redirect to="/result" />
    );
  }

  switch (question.type) {
    case GameType.ARTIST:
      return (
        <ArtistQuestionScreenWrapped
          question={question}
          onAnswer={onUserAnswer}
        >
          <Mistakes count={mistakes}/>
        </ArtistQuestionScreenWrapped>
      );
    case GameType.GENRE:
      return (
        <GenreQuestionScreenWrapped
          question={question}
          onAnswer={onUserAnswer}
        >
          <Mistakes count={mistakes} />
        </GenreQuestionScreenWrapped>
      );
  }

  return <Redirect to="/" />;
};

GameScreen.propTypes = {
  questions: PropTypes.arrayOf(
      PropTypes.oneOfType([artistQuestionProp, genreQuestionProp]).isRequired
  ),
  step: PropTypes.number.isRequired,
  onUserAnswer: PropTypes.func.isRequired,
  mistakes: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  step: state.step,
  mistakes: state.mistakes,
  questions: state.questions,
});

const mapDispatchToProps = (dispatch) => ({
  resetGame() {
    dispatch(ActionCreator.resetGame());
  },
  onUserAnswer(question, answer) {
    dispatch(ActionCreator.incrementStep());
    dispatch(ActionCreator.incrementMistake(question, answer));
  },
});

export {GameScreen};
export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);
