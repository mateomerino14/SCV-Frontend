const maxLength = 300;

function useCommentTextarea(text) {
  const exceedsLimit = text.length > maxLength;
  return {maxLength, exceedsLimit};
}

export default useCommentTextarea;