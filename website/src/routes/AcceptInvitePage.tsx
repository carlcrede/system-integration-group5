import {
  Box,
  Flex,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Button,
  Input,
} from "@chakra-ui/react"
import { Field, Form, Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import PageTemplate from "../containers/PageTemplate";
import { useInvites } from "../hooks/useInvites";

function AcceptInvitePage() {
  const navigate = useNavigate();
  const { acceptInvite } = useInvites();

  return (
    <PageTemplate selectedIndex={2}>
      <Box w="100%">
        <Flex h='calc(100vh - 350px)' flexDirection="column">
          <VStack>
            <Text fontSize='x-large'>Accept Invites</Text>
            <Formik
              initialValues={{ token: '' }}
              onSubmit={async (values, actions) => {
                const acceptInviteRes = await acceptInvite(values.token)
                actions.setSubmitting(false)
                if (acceptInviteRes) {
                  navigate('/accept-invites')
                }
              }}
            >
              {(props) => (
                <Form>
                  <Field name='token'>
                    {({ field }) => (
                      <FormControl>
                        <FormLabel>Token</FormLabel>
                        <Input {...field} type='text' placeholder='96205327-b844-409e-aad3-eb6a200a4595' />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                  >
                    Accept invite
                  </Button>
                </Form>
              )}
            </Formik>
          </VStack>
        </Flex>
      </Box>
    </PageTemplate>
  )
}

export default AcceptInvitePage;