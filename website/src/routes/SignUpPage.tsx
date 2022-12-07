import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text, useToast } from "@chakra-ui/react"
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../containers/PageTemplate";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validateName, validatePassword } from "../utils/inputValidation";

function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  return (
    <PageTemplate selectedIndex={1}>
      <Flex flexDir='column' align={'center'} justifyContent={'center'}>
      <Text fontSize='x-large'>Sign Up</Text>
        <Formik
          initialValues={{ email: '', password: '', firstName: '', lastName: '', repeatPassword: '' }}
          onSubmit={async (values, actions) => {
            const res = await signUp(values.email, values.password, values.firstName, values.lastName)
            actions.setSubmitting(false)
            if (res) {
              navigate('/login')
            }
          }}
          >
          {(props) => (
            <Form>
              <Field name='firstName' validate={validateName}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input {...field} placeholder='John' />
                    <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='lastName' validate={validateName}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input {...field} placeholder='Wick' />
                    <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='email' validate={validateEmail}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.email && form.touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type='email' placeholder='email@email.com' />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='password' validate={validatePassword}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.password && form.touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Input {...field} type='password' placeholder='Password123' />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='repeatPassword' validate={validatePassword}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.repeatPassword && form.touched.repeatPassword}>
                    <FormLabel>Repeat Password</FormLabel>
                    <Input {...field} type='password' placeholder='Password123' />
                    <FormErrorMessage>{form.errors.repeatPassword}</FormErrorMessage>
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
      </Flex>
    </PageTemplate>
  )
}

export default SignUpPage;