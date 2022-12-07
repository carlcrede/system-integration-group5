import {
  Container,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Input,
} from "@chakra-ui/react"
import { Field, Form, Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import PageTemplate from "../containers/PageTemplate";
import { useInvites } from "../hooks/useInvites";
import { validateEmail } from "../utils/inputValidation";

function SendInvitePage() {
  const navigate  = useNavigate();
  const { sendInvite } = useInvites();

  return (
    <PageTemplate selectedIndex={1}>
    <Container maxW='xs' centerContent>
      <VStack>
      <Text fontSize='x-large'>Send Invites</Text>
        <Formik
          initialValues={{ email: ''}}
          onSubmit={async (values, actions) => {
              const sendInviteRes = await sendInvite(values.email)
              actions.setSubmitting(false)
              if (sendInviteRes) {
                navigate('/send-invites')
              }
          }}
          >
          {(props) => (
            <Form>
              <Field name='email' validate={validateEmail}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.email && form.touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type='email' placeholder='email@email.com' />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme='teal'
                isLoading={props.isSubmitting}
                type='submit'
                >
                Send invite
              </Button>
            </Form>
          )}
        </Formik>
      </VStack>
    </Container>
    </PageTemplate>
  )
}

export default SendInvitePage;