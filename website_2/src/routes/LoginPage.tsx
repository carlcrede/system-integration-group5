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
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/inputValidation";

function LoginPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  return (
    <PageTemplate selectedIndex={0}>
    <Container maxW='xs' centerContent>
      <VStack>
      <Text fontSize='x-large'>Login</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, actions) => {
              const loginRes = await login(values.email, values.password)
              actions.setSubmitting(false)
              if (loginRes) {
                navigate('/')
              }
          }}
          >
          {(props) => (
            <Form>
              <Field name='email' validate={validateEmail}>
                {({ field, form }: {field:any, form:any}) => (
                  <FormControl isInvalid={form.errors.email && form.touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type='email' placeholder='email@email.com' />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='password' validate={validatePassword}>
                {({ field, form }: {field:any, form:any}) => (
                  <FormControl isInvalid={form.errors.password && form.touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Input {...field} type='password' placeholder='Password123' />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme='teal'
                isLoading={props.isSubmitting}
                type='submit'
                >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </VStack>
    </Container>
    </PageTemplate>
  )
}

export default LoginPage;