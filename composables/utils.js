export const useHandleSubmit = async({ formEl, callback }) => {
  try {
    if(formEl)
      await formEl.validate()
    await useFullScreenLoading([callback])
  }
  catch (error) {
    throw createError(error)
  }
}